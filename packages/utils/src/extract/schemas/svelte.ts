import { Lang } from "@ast-grep/napi"; 
import { loadAstConfig } from "../utils/loadAstConfig"; 

export default [
    {
        name    : "script",
        language: Lang.TypeScript,
        extract: /<script[^>]*>([\s\S]*?)<\/script>/gm,
        ast     : loadAstConfig("./ts.yaml",__dirname)
    },
    {
        name    : "template",
        language: Lang.Tsx,
        extract: {
            exclude: /<script[^>]*>([\s\S]*?)<\/script>/gm
        },
        ast     : loadAstConfig("./tsx.yaml",__dirname)
    } 
]