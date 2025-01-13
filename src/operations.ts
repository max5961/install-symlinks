import path from "node:path";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import * as Util from "./util.js";
import { Config } from "./types.js";
import { args } from "./parseArgs.js";

const FORCE = args.force ? "--force" : "";

export function manage(config: Config, operation: "clean" | "remove" | "update") {
    Object.entries(config).forEach(([dirpath, entrypoints]) => {
        entrypoints = Util.toArray(entrypoints);
        const resolvedDirpath = Util.resolvePath(dirpath);

        const pkgname = Util.getLinkedPackageName(dirpath);

        // Uninstall package
        spawnSync("npm", ["uninstall", pkgname, FORCE], { stdio: "inherit" });

        if (operation === "update") {
            spawnSync("npm", ["install", resolvedDirpath, FORCE], { stdio: "inherit" });
            linkEntryPoints(resolvedDirpath, entrypoints);
        }

        if (operation === "remove" || operation === "clean") {
            removeFromConfig(dirpath);
        }
    });
}

export function removeFromConfig(dirpath: string) {
    const resolvedDirpath = Util.resolvePath(dirpath);
    const config = Util.getConfig();

    let targetKey = "";

    for (const key in config) {
        const resolvedKey = Util.resolvePath(key);
        if (resolvedKey === resolvedDirpath) {
            targetKey = key;
            break;
        }
    }

    if (config[targetKey]) {
        delete config[targetKey];
    }

    const pkg = Util.getPackage();
    pkg[Util.PropertyName] = config;
    Util.writePackage(pkg);
}

export function linkEntryPoints(dirpath: string, entrypoints: string[]): void {
    dirpath = Util.resolvePath(dirpath);
    const pkgname = Util.getLinkedPackageName(dirpath);

    entrypoints.forEach((entry) => {
        const target = path.join(dirpath, entry);
        const pointer = path.join(path.resolve("node_modules"), pkgname, entry);

        const stats = fs.lstatSync(pointer);

        stats.isFile() && fs.rmSync(pointer, { force: true });
        stats.isSymbolicLink() && fs.unlinkSync(pointer);

        fs.symlinkSync(target, pointer);
    });
}
