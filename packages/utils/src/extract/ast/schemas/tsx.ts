import { Lang } from "@ast-grep/napi";
import { loadAstConfig } from "../loadAstConfig"; 

export default [ 
    {
        name    : "typescript",
        language: Lang.Tsx, 
        ast     : loadAstConfig("./tsx.yaml",__dirname)
    }
] 