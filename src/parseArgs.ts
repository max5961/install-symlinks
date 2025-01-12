import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const args = yargs(hideBin(process.argv))
    .option("clean", {
        type: "boolean",
        desc: "Remove all symlinks in localSymlinks and dependencies",
    })
    .option("force", {
        type: "boolean",
        desc: "Skip dependency checks before creating symlink",
    })
    .option("install", {
        type: "string",
        desc: "Install a local package or packages by path",
        array: true,
        default: [],
        requiresArg: true,
    })
    .option("uninstall", {
        type: "string",
        desc: "Uninstall a local package or packages by path",
        array: true,
        default: [],
        requiresArg: true,
    })
    .parseSync();
