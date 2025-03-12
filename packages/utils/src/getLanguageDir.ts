/**
 *
 * 获取VoerkaI18n语言文件夹
 * 
 */

import { getSettingsFromPackageJson } from "./getSettingsFromPackageJson"
import fs from "node:fs"
import path from "node:path"  
import { getDefaultLanguageDir } from "./getDefaultLanguageDir"


export type LanguagesDirOptions = {
    location?   : string
    autoCreate? : boolean
    absolute?   : boolean           // 是否返回绝对路径
}

/**
 * 
 * 获取语言工作文件夹
 * 
 * - 读取package.json中的voerkai18n字段
 * - 如果没有，则在当前文件夹下查找
 *      - <src/languages>
 *      - <languages>
 * 
 * 如果目录不存在，则自动创建
 * 
 * 
 * @returns 
 * @param location 指定入口文件夹
 * @param created 是否创建
 */
export function getLanguageDir(options?:LanguagesDirOptions):string{    
    const { location,autoCreate,absolute } = Object.assign({
        autoCreate:true,
        absolute:true
    }, options)      

    const cwd = process.env.INIT_CWD ||  process.cwd()

    try{
        const { entry } = getSettingsFromPackageJson(location)     

        let langDir :string = entry || getDefaultLanguageDir() 
        langDir = path.isAbsolute(langDir) ?  langDir : path.join(cwd,langDir)

        if(autoCreate && !fs.existsSync(langDir)){
            fs.mkdirSync(langDir)
        }

        return absolute ? langDir : path.relative(cwd,langDir)

    }catch(e){
        console.error("获取语言文件夹失败",e)
        return "src/languages"
    }    
}
