import { args } from "./parseArgs.js";
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import detectIndent from "detect-indent";
import * as Util from "./util.js";

export function manage(localPaths: string[], operation: "install" | "uninstall") {
    localPaths.forEach((localPath) => {
        if (!Util.canResolve(localPath)) {
            return console.log(
                Util.errorMsg(`Could not install ${localPath}. Path is not valid`),
            );
        }

        const target = path.resolve(localPath);

        // If --force, do not install via npm before creating symlink (no dependency checks)
        // The package also won't be in your dependencies unless it already was
        if (!args.force) {
            const { status } = spawnSync("npm", [operation, target], {
                stdio: "inherit",
            });

            if (status !== 0) {
                Util.errorMsg(`Could not install: ${localPath}`);
                Util.errorMsg(
                    "Use --force (dangerous operation) to forcefully install the symlink",
                );
            }
        }

        if (operation === "install") {
            createSymlink(localPath);
        } else {
            removeFromConfig(localPath);
        }
    });
}

export function createSymlink(localPath: string) {
    if (!Util.canResolve(localPath)) {
        return console.log(`Could not resolve path: ${localPath}`);
    }

    const target = path.resolve(localPath);
    const pkgName = Util.getPackageName(localPath);
    const pointer = path.resolve(Util.Path.NodeModules + pkgName);

    // Forcefully remove the node_modules directory if it exists
    fs.rmSync(pointer, { recursive: true, force: true });

    fs.symlinkSync(target, pointer);
}

export function removeFromConfig(localPath: string) {
    const json = fs.readFileSync(path.resolve("package.json"), "utf-8");
    const indent = detectIndent(json).indent || "    ";
    const pkgjson = JSON.parse(json);

    pkgjson[Util.PropertyName] = (pkgjson[Util.PropertyName] as string[]).filter(
        (str) => {
            path.resolve(str) !== path.resolve(localPath);
        },
    );

    fs.writeFileSync(
        path.resolve("package.json"),
        JSON.stringify(pkgjson, null, indent),
        "utf-8",
    );
}
