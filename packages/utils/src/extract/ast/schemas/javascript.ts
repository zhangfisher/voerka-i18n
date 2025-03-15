import { Lang } from "@ast-grep/napi"; 
import { loadAstConfig } from "../loadAstConfig"; 

export default [ 
    {
        name    : "script",
        language: Lang.JavaScript, 
        ast     : loadAstConfig("./js.yaml",__dirname)
    }
]