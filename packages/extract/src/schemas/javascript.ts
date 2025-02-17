import { Lang } from "@ast-grep/napi"; 
import { loadAstConfig } from "../utils/loadAstConfig"; 

export default [ 
    {
        name    : "typescript",
        language: Lang.JavaScript, 
        ast     : loadAstConfig("./js.yaml",__dirname)
    }
]