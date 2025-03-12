import { Lang } from "@ast-grep/napi"; 
import { loadAstConfig } from "../utils/loadAstConfig"; 

export default [ 
    {
        name    : "typescript",
        language: Lang.TypeScript, 
        ast     : loadAstConfig("./ts.yaml",__dirname)
    }
]