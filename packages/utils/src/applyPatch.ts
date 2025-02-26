import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { getLanguageDir } from "./getLanguageDir"
import { readJsonFile, readJsonFileAsync } from "flex-tools/fs/readJsonFile"
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

type PatchContext = {
    langDir        : string
    langSettings?  : Record<string,any>
    idMap?         : Record<string,any>
    defaultLanguage: string
}

let patchCtx:PatchContext
let translateFiles:Record<string,Record<string,any>> = {}              // 保存翻译文件{file:messages}
let idMaps:Record<string,Record<string,Record<string,any>>> = {}    // { file:{ id: message } }

async function loadTranslateFiles(){
    const  { defaultLanguage } = patchCtx
    if(Object.keys(translateFiles).length===0){
        const files = await fastGlob(['*.json'],{
            cwd: path.join(patchCtx.langDir,"translates"),
            absolute:true
        })        
        for(let file of files){
            try{
                const messages = await readJsonFileAsync(file)
                if(!messages) return
                translateFiles[file]=messages
                idMaps[file] = {}
                Object.entries(messages).forEach(([message,info])=>{
                    if(info.$id){
                        idMaps[file][info.$id] = info
                        idMaps[file][info.$id][defaultLanguage] = message
                    }
                }) 
            }catch(e){
                console.error("[VoerkaI18n] Read translate file error: ", e)
            }
        }
    }
}

function createPatchContext():PatchContext{
    if(!patchCtx){
        const langDir = getLanguageDir()
        const idMap = getIdMap()
        const langSettings = readJsonFile(path.join(langDir,"settings.json"))
        const defaultLanguage = langSettings?.languages.find((lang:any)=>lang.default)?.name
        patchCtx ={ langDir, idMap, langSettings, defaultLanguage} 
    }
    return patchCtx
}
/**
 * 将patch应用到语言包中
 */
export async function applyPatch(patch:VoerkaI18nMessagePatch){
    if(!isPlainObject(patch)) return 

    const {langDir, idMap, langSettings,defaultLanguage} = createPatchContext()

    await loadTranslateFiles()

    if(!langDir || !idMap) return 

    const  { language,message,scope, id:msgId } = patch
    const langMessages = fs.readFileSync(path.join(langDir,`${language}.json`),'utf-8')

    let defaultMessage = msgId
    if(isMessageId(msgId)){
        
    }


    // 先更新原始的翻译文件
    if(!isMessageId(msgID)){
        Object.entries(translateFiles).forEach(([file,messages])=>{
            
        })
        const messages = translateFiles[path.join(langDir,"translates",`${language}.json`)]
        if(messages){
            messages[msgID] = message
            writeJsonFile(path.join(langDir,"translates",`${language}.json`),messages)
        }
    }


    
}