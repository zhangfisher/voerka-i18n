import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { getLanguageDir } from "./getLanguageDir"
import { readJsonFile } from "flex-tools/fs/readJsonFile"
import { writeJsonFile } from "flex-tools/fs/writeJsonFile"
import fastGlob from "fast-glob"
import { getIdMap } from "./getIdMap"
import path from "node:path"
import fs from "node:fs"
import { isMessageId } from "./isMessageId"
import { default } from '../../plugins/src/vite/config';




export type VoerkaI18nMessagePatch = {
    language  : string
    message   : string
    scope     : string
    id        : string
}

const langDir = getLanguageDir()
const idMap = getIdMap()
const langSettings = readJsonFile(path.join(langDir,"settings.json"))
const defaultLanguage = langSettings?.languages.find((lang:any)=>lang.default)?.name


/**
 * 将patch应用到语言包中
 */
export async function applyPatch(patch:VoerkaI18nMessagePatch){
    if(!isPlainObject(patch)) return 
    
    

    if(!langDir || !idMap) return

    const files = await fastGlob(['*.json'],{
        cwd: path.join(langDir,"translates"),
        absolute:true
    })            
    
    const  { language,message,scope, id:msgID } = patch
    const langMessages = fs.readFileSync(path.join(langDir,`${language}.json`),'utf-8')


    files.forEach(file=>{
        try{
            const messages = readJsonFile(file)
            if(!messages) return
            

            

            if(isMessageId(msgID)){ // 如果已经编译时，msgId是一个数字

            }else{ // 没有经过映射的
                if(msgID in messages){
                    messages[msgID][language] = message
                }
            }
            const defaultMsg = isMessageId(msgID) ? idMap[msgID] : msgID
             

            // const message = messages[patch.id]
            // if(message){
            //     message[patch.language] = patch.message
            //     writeJsonFile(file,messages)
            // }

        }catch(e){
            console.error("Apply patch error: ", e)
        }
        
    })


    
}