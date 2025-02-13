import { Lang } from "@ast-grep/napi";
import { jsConfig } from "./common";
import { loadAstConfig } from "../utils/loadAstConfig";
import path from "node:path"

export default {
    sections: [
        {
            name: "template",
            regex: /<template[\s\S]*?>([\s\S]*?)<\/template\s*>/,
            language:Lang.Html,
            config:  loadAstConfig(path.join(__dirname,"./vue.yaml"))
        },
        {
            name: "script",
            language:Lang.TypeScript,
            regex: /<script[\s\S]*?>([\s\S]*?)<\/script\s*>/,
            config: jsConfig
        },
        {
            name: "setup",
            language:Lang.TypeScript,
            regex: /<script[\s\S]*?setup[\s\S]*?>([\s\S]*?)<\/script\s*>/,
            config: jsConfig
        }
    ]
}