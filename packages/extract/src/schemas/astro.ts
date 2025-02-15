import { Lang } from "@ast-grep/napi";
import { jsConfig } from "./common";
import { loadAstConfig } from "../utils/loadAstConfig";
import path from "node:path"

export default {
    sections: [
        {
            name    : "frontmatter",
            regex   : /^\s*^---([\s\S]*?)^---/gm,
            language: Lang.TypeScript,
            config  : jsConfig
        },
        {
            name    : "template",
            language: Lang.Tsx,
            regex   : /^\s*---[\s\S]*?^---\s*([\s\S]*)/gm,
            config  : loadAstConfig(path.join(__dirname,"./tsx.yaml"))
        } 
    ]
}