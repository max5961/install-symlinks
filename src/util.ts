import fs from "node:fs";
import path from "node:path";
import detectIndent from "detect-indent";
import { Config } from "./types.js";

export const Path = {
    NodeModules: path.resolve("node_modules") + "/",
    PkgJson: path.resolve("package.json"),
};

export const PropertyName = "local-symlinks";

export function errorMsg(msg: string): string {
    return `local-symlinks: ${msg}`;
}

export function getConfig(): Config {
    const json = fs.readFileSync(path.resolve("package.json"), { encoding: "utf-8" });
    const pkgjson = JSON.parse(json);
    const paths = pkgjson[PropertyName] as unknown;

    if (typeof paths !== "object" || paths === null) {
        throw new Error(errorMsg("Configuration must be of type 'object'"));
    }

    const isValid = Object.entries(paths).every(([k, v]) => {
        if (typeof k !== "string") return false;
        if (!Array.isArray(v)) return false;
        return v.every((value) => typeof value === "string");
    });

    if (!isValid) {
        throw new Error(errorMsg("Invalid configuration"));
    }

    return paths as Config;
}

export function getLinkedPackageName(linkPath: string): string {
    const json = fs.readFileSync(path.resolve(`${linkPath}/package.json`), "utf-8");
    const pkgjson = JSON.parse(json);
    return pkgjson["name"] as string;
}

export function resolvePath(linkPath: string): string {
    const resolved = path.resolve(linkPath);
    if (fs.existsSync(resolved)) {
        return resolved;
    } else {
        throw new Error(errorMsg(`Cannot resolve path: ${linkPath}`));
    }
}

export function toArray(strOrArray: string | string[]): string[] {
    return [...(Array.isArray(strOrArray) ? strOrArray : strOrArray)];
}

export function getPackage(): { [key: string]: any } {
    const json = fs.readFileSync(path.resolve("package.json"), "utf-8");
    return JSON.parse(json);
}

export function writePackage(data: object): void {
    const json = fs.readFileSync(path.resolve("package.json"), "utf-8");
    const indent = detectIndent(json).indent || "    ";
    fs.writeFileSync(
        path.resolve("package.json"),
        JSON.stringify(data, null, indent),
        "utf-8",
    );
}
