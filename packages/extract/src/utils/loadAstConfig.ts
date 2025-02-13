import path from "node:path";
import fs from "node:fs";
import Yaml from "yaml"

export function loadAstConfig(file:string){
    const configFile = path.resolve(file)
    const config = fs.readFileSync(configFile, "utf-8")
    return Yaml.parse(config)
}