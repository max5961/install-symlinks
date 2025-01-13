import fs from "node:fs";
import path from "node:path";
import detectIndent from "detect-indent";
import { Config } from "./types.js";

export const Path = {
    NodeModules: path.resolve("node_modules") + "/",
    PkgJson: path.resolve("package.json"),
};

export const PropertyName = "directlinks";

export function errorMsg(msg: string): string {
    console.log(`directlink: ${msg}`);
    process.exit(1);
}

export function getConfig(): Config {
    const json = fs.readFileSync(path.resolve("package.json"), { encoding: "utf-8" });
    const pkgjson = JSON.parse(json);
    const paths = pkgjson[PropertyName] as unknown;

    if (typeof paths !== "object" || paths === null) {
        errorMsg("Configuration must be of type 'object'");
        process.exit();
    }

    const isValid = Object.entries(paths).every(([k, v]) => {
        if (typeof k !== "string") return false;
        if (!Array.isArray(v)) return false;
        return v.every((value) => typeof value === "string");
    });

    if (!isValid) {
        errorMsg("Invalid configuration");
        process.exit();
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
        errorMsg(`Cannot resolve path: ${linkPath}`);
        process.exit();
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
