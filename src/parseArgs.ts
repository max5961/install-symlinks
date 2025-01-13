import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const args = yargs(hideBin(process.argv))
    .option("clean", {
        type: "boolean",
        desc: "Uninstall all packages in 'directlinks'",
        default: false,
        requiresArg: false,
    })
    .option("remove", {
        type: "string",
        desc: "Uninstall package(s) in 'directlinks' by path",
        array: true,
        default: [],
        requiresArg: true,
    })
    .option("update", {
        type: "boolean",
        desc: "Update all packages in 'directlinks'",
        requiresArg: false,
    })
    .option("force", {
        type: "boolean",
        desc: "Force install/uninstall when updating",
        default: false,
        requiresArg: false,
    })
    .parseSync();
