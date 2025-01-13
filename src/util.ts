import fs from "node:fs";
import path from "node:path";
import detectIndent from "detect-indent";

export const Path = {
    NodeModules: path.resolve("node_modules") + "/",
    PkgJson: path.resolve("package.json"),
};

export const PropertyName = "local-symlinks";

export function errorMsg(msg: string): string {
    return `local-symlinks: ${msg}`;
}

export function getLocalPaths(): string[] {
    const json = fs.readFileSync(path.resolve("package.json"), { encoding: "utf-8" });
    const pkgjson = JSON.parse(json);
    const paths = pkgjson[PropertyName] as unknown;

    if (!Array.isArray(paths)) {
        throw new Error(errorMsg("Configuration must be of type 'array'"));
    }

    if (!paths.every((path) => typeof path === "string")) {
        throw new Error(
            errorMsg("Configuration array must only accept arrays as values"),
        );
    }

    return paths.map(resolvePath);
}

export function getLinkedPackageName(localPath: string): string {
    const json = fs.readFileSync(path.resolve(`${localPath}/package.json`), "utf-8");
    const pkgjson = JSON.parse(json);
    return pkgjson["name"] as string;
}

export function canResolve(localPath: string): boolean {
    const resolved = path.resolve(localPath);
    return fs.existsSync(resolved);
}

export function resolvePath(localPath: string): string {
    if (canResolve(localPath)) return path.resolve(localPath);
    throw new Error(errorMsg(`Cannot resolve path: ${localPath}`));
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
