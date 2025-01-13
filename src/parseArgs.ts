import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const args = yargs(hideBin(process.argv))
    .option("clean", {
        type: "boolean",
        desc: "Remove all symlinks in localSymlinks and dependencies",
    })
    .option("remove", {
        type: "string",
        desc: "Uninstall a local package or packages by path",
        array: true,
        default: [],
        requiresArg: true,
    })
    .option("update", {
        type: "boolean",
        desc: "Update all local packages",
        requiresArg: false,
    })
    .option("force", {
        type: "boolean",
        desc: "Force install/uninstall when updating",
        default: false,
        requiresArg: false,
    })
    .parseSync();
