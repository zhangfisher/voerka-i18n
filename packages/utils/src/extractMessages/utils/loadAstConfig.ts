import path from "node:path";
import fs from "node:fs";
import Yaml from "yaml"

export function loadAstConfig(file:string){
    const configPath = path.resolve(file)
    const config = fs.readFileSync(configPath, "utf-8")
    
}