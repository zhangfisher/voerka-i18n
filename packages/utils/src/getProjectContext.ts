
import type { VoerkaI18nSettings } from "@voerkai18n/runtime"
import  { getLanguageDir } from "./getLanguageDir"
import { getVoerkaI18nSettings } from "./getVoerkaI18nSettings"
import { getPackageModuleType } from "flex-tools/package/getPackageModuleType"
import { isTypeScriptPackage } from "flex-tools/package/isTypeScriptPackage"
import { readFile } from "flex-tools/fs/nodefs"
import path from "node:path"
import fs from "node:fs"  

export type VoerkaI18nProjectContext= VoerkaI18nSettings & { 
    rootDir                  : string
    langDir                  : string    
    langRelDir               : string
    settingFile              : string
    settingRelFile           : string
    typescript               : boolean
    moduleType               : "esm" | "cjs" | undefined
    promptDir                : string 
    getTranslateMessagesDir  : (autoCreate?:boolean)=>string
    getTranslateParagraphsDir: (autoCreate?:boolean)=>string
    getMessagesDir           : (autoCreate?:boolean)=>string
    getParagraphsDir         : (autoCreate?:boolean)=>string
    getPrompt                : (name:string)=>Promise<string>
    getApi                   : (name:string,defaultValue?:Record<string,any>)=>Record<string,any> | undefined
    api                      : Record<string,any> | undefined
}



async function getPromptTemplate(this:VoerkaI18nProjectContext,name:string,defaultPrompt?:string){
    const { promptDir } = this;
    if(!name) return defaultPrompt
    const promptFile = path.isAbsolute(name) ? name : path.join(promptDir,name.endsWith(".md") ? name : name+".md");
    if(fs.existsSync(promptFile)){
        return await readFile(promptFile,{ encoding: "utf-8" });
    }
    return defaultPrompt
}

function getDefaultPatterns(this:VoerkaI18nProjectContext,options?:Record<string,any>){
    
    const patterns = [
        "!coverage",
        "!.pnpm",
        "!**/*.test.*",
        "!**/*.spec.*",
        "!.vscode",
        "!dist",
        "!.git",
        "!.turbo",
        "!**/*.d.ts",
        "!*.config.{js,ts}",
        "!node_modules",
        "!"+this.langRelDir 
    ]
    if(Array.isArray(this.patterns)){
        patterns.push(...this.patterns)
    }
    
    if(Array.isArray(options?.patterns)){
        patterns.push(...options.patterns)
        delete options.patterns
    }else if(typeof(options?.patterns)==='string'){
        patterns.push(options.patterns)
        delete options.patterns
    }

    // 如果所有的patterns都是排除模式，则添加默认的包含模式
    if(patterns.every(p=>p.startsWith("!"))){
        patterns.push("**/*.{js,jsx,ts,tsx,vue,astro,svelte,mdx}")
    }
    return patterns
}

function getApi(this:VoerkaI18nProjectContext,name:string,defaultValue?:Record<string,any>){
    const { langDir } = this;
    const apiFile= path.join(langDir,"api.json")
    let apis:Record<string,any> = {}
    try{
        if(fs.existsSync(apiFile)){
            apis = JSON.parse(fs.readFileSync(apiFile,"utf-8"))
        }
    }catch{}  
    return apis[name] || defaultValue  
} 

function getApiParams(this:VoerkaI18nProjectContext,options?:Record<string,any>){
    if(typeof(options)==='object'){
        let api:Record<string,any> | undefined
        if(typeof(options.api)==='string'){
            api = getApi.call(this,options.api,{})
        }
        Object.entries(options).forEach(([key,value])=>{
            if(key.startsWith("api") && key.length>3){
                const name = key.substring(3)                
                if(!api) api = {}
                api[name[0].toLowerCase() + name.substring(1)] = value
            }
        })
        return api
    }
}
 

function getDir(this:VoerkaI18nProjectContext,location:string){
    return (autoCreate:boolean=true)=>{
        const dir =  path.join(this.langDir,location)
        if(autoCreate && !fs.existsSync(dir)){            
            fs.mkdirSync(dir,{recursive:true})
        }
        return dir
    }
    
} 
/**
 * 
 * @param options 
 * @returns 
 */
export async function getProjectContext(options?:Record<string,any>) {     
    const ctx          = await getVoerkaI18nSettings() as VoerkaI18nProjectContext    
    ctx.rootDir        = process.env.INIT_CWD || process.cwd()
    ctx.langDir        = getLanguageDir()
    ctx.langRelDir     = path.relative(process.cwd(),ctx.langDir).replaceAll(path.sep,"/")    
    ctx.settingFile    = path.join(ctx.langDir, "settings.json")
    ctx.settingRelFile = path.relative(process.cwd(),ctx.settingFile).replace(/\\/g,'/')
    ctx.promptDir      = path.join(ctx.langDir,"prompts")
    ctx.getPrompt      = getPromptTemplate.bind(ctx) 
    ctx.patterns       = getDefaultPatterns.call(ctx,options)    
    ctx.getApi         = getApi.bind(ctx) 
    ctx.getTranslateMessagesDir = getDir.call(ctx,"translates/messages").bind(ctx)
    ctx.getTranslateParagraphsDir = getDir.call(ctx,"translates/paragraphs").bind(ctx)
    ctx.getMessagesDir = getDir.call(ctx,"messages").bind(ctx)
    ctx.getParagraphsDir = getDir.call(ctx,"paragraphs").bind(ctx)
    if(!ctx.typescript) ctx.typescript = isTypeScriptPackage()
    if(!ctx.moduleType) ctx.moduleType = getPackageModuleType()    
    Object.assign(ctx,options)
    ctx.api = getApiParams.call(ctx,options) 
    return ctx
}
