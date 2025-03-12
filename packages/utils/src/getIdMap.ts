import path from "node:path"
import fs from "node:fs"
import { getLanguageDir } from "./getLanguageDir"

export function getIdMap(idMapFile?:string): Record<string,string> | undefined{
    if(!idMapFile){
        const langDir = getLanguageDir({autoCreate:false,absolute:true})
        idMapFile = path.join(langDir,"idMap.json")
    }    
    try{        
        if(fs.existsSync(idMapFile!)){
            return JSON.parse(fs.readFileSync(idMapFile!,{encoding:"utf-8"}))
        }
    }catch{

    } 
}