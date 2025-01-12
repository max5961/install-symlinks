#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { args } from "./parseArgs.js";
import * as Util from "./util.js";
import * as Operations from "./operations.js";

fs.mkdirSync(path.resolve(Util.Path.NodeModules), { recursive: true });

args.install = (args.install ?? []).map(Util.resolvePath);
args.uninstall = (args.uninstall ?? []).map(Util.resolvePath);

// If there are install/uninstall arguments, only operate on those
if (args.install.length || args.uninstall.length) {
    Operations.manage(args.install, "install");
    Operations.manage(args.uninstall, "uninstall");
    process.exit();
}

const localPaths = Util.getLocalPaths();

if (args.clean) {
    Operations.manage(localPaths, "uninstall");
    process.exit();
}

Operations.manage(localPaths, "install");
