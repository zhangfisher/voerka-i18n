import { Lang } from "@ast-grep/napi";
import { loadAstConfig } from "../utils/loadAstConfig";
import path from "node:path"

export default {
    sections: [ 
        {
            name    : "typescript",
            language: Lang.Tsx, 
            config  : loadAstConfig(path.join(__dirname,"./tsx.yaml"))
        }
    ]
}