import { Lang } from "@ast-grep/napi";
import { jsConfig } from "./common"; 

export default {
    sections: [ 
        {
            name    : "typescript",
            language: Lang.JavaScript, 
            config  : jsConfig
        }
    ]
}