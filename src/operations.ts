import { args } from "./parseArgs.js";
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
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
        if (!args.force && operation === "install") {
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
            remove(localPath);
        }
    });
}

export function createSymlink(localPath: string) {
    if (!Util.canResolve(localPath)) {
        return console.log(`Could not resolve path: ${localPath}`);
    }

    const target = path.resolve(localPath);
    const pkgName = Util.getLinkedPackageName(localPath);
    const pointer = path.resolve(Util.Path.NodeModules + pkgName);

    // Forcefully remove the node_modules directory if it exists
    fs.rmSync(pointer, { recursive: true, force: true });

    fs.symlinkSync(target, pointer);

    const pkgjson = Util.getPackage();

    const configPaths = ((pkgjson[Util.PropertyName] as string[]) ?? []).slice();

    if (
        !configPaths.some((str) => {
            return path.resolve(str) === path.resolve(localPath);
        })
    ) {
        configPaths.push(path.relative(process.cwd(), localPath));
    }

    pkgjson[Util.PropertyName] = configPaths;

    Util.writePackage(pkgjson);
}

export function remove(localPath: string) {
    // Can only 'npm uninstall bar', 'npm uninstall ../bar' does not work.
    const targetPathPackageName = Util.getLinkedPackageName(localPath);
    spawnSync("npm", ["uninstall", targetPathPackageName], { stdio: "inherit" });

    const pkgjson = Util.getPackage();

    pkgjson[Util.PropertyName] = (pkgjson[Util.PropertyName] as string[]).filter(
        (str) => {
            path.resolve(str) !== path.resolve(localPath);
        },
    );

    Util.writePackage(pkgjson);
}
