import { Lang } from "@ast-grep/napi";
import { jsConfig } from "./common";
import { loadAstConfig } from "../utils/loadAstConfig";
import path from "node:path"

export default {
    sections: [
        {
            name: "script",
            language:Lang.TypeScript,
            regex: /<script\s*(\w+|\w+=[\"\'\w+]*?)?\s*>([\s\S]*?)<\/script>/gm,
            config: jsConfig
        },
        {
            name    : "template",
            language: Lang.Tsx,
            regex   : /^\s*---[\s\S]*?^---\s*([\s\S]*)/gm,
            config  : loadAstConfig(path.join(__dirname,"./tsx.yaml"))
        } 
    ]
}