import { Lang } from "@ast-grep/napi";
import { loadAstConfig } from "../utils/loadAstConfig";
import { ExtractSections } from ".."; 

export default  [
    {
        name    : "template",
        language: Lang.Html,
        extract: /<template[\s\S]*?>([\s\S]*?)<\/template\s*>/gm,            
        ast     : loadAstConfig("./vue-template.yaml",__dirname)
    },
    {
        name    : "script",
        language: Lang.TypeScript,
        extract: /<script[\s\S]*?>([\s\S]*?)<\/script\s*>/gm,
        ast     : loadAstConfig("./ts.yaml",__dirname)
    },
    {
        name    : "script/setup",
        language: Lang.TypeScript,
        extract: /<script[\s\S]*?setup[\s\S]*?>([\s\S]*?)<\/script\s*>/gm,
        ast     : loadAstConfig("./ts.yaml",__dirname)
    }
]  as ExtractSections