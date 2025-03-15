import { Lang } from "@ast-grep/napi"; 
import { loadAstConfig } from "../loadAstConfig"; 

export default [
        {
            name    : "frontmatter",
            extract : /^\s*^---([\s\S]*?)^---/gm,
            language: Lang.TypeScript,
            ast     : loadAstConfig("./ts.yaml",__dirname)
        },
        {
            name    : "template",
            language: Lang.Tsx,
            extract : /^\s*---[\s\S]*?^---\s*([\s\S]*)/gm,
            ast     : loadAstConfig("./tsx.yaml",__dirname)
        } 
    ] 