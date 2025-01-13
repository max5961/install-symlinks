#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { args } from "./parseArgs.js";
import * as Util from "./util.js";
import * as Operations from "./operations.js";

fs.mkdirSync(path.resolve(Util.Path.NodeModules), { recursive: true });

const remove = (args.remove ?? []) as string[];
const update = args.update;
const clean = args.clean;

const config = Util.getConfig();

if (update) {
    Operations.manage(config, "update");
    process.exit();
}

if (clean) {
    Operations.manage(config, "clean");
    process.exit();
}

if (remove.length) {
    const removeConfig: { [key: string]: string[] } = {};

    for (const linkpath of remove) {
        const resolvedLinkpath = Util.resolvePath(linkpath);
        for (const key in config) {
            const resolvedKey = Util.resolvePath(key);
            if (resolvedKey === resolvedLinkpath) {
                removeConfig[resolvedKey] = config[key];
            }
        }
    }

    Operations.manage(removeConfig, "remove");
    process.exit();
}

Util.errorMsg("Provide an argument: npx directlink --help");
