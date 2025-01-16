/**
 *
 * 获取VoerkaI18n语言文件夹
 * 
 */

import { getSettingsFromPackageJson } from "./getSettingsFromPackageJson"
import fs from "node:fs"
import path from "node:path" 
import { getExistedDir } from "flex-tools/fs/getExistedDir"
import { getProjectSourceFolder } from "./getProjectSourceFolder"
import { getDefaultWorkDir } from "./getDefaultWorkDir"


export type WorkDirOptions = {
    location?   : string
    autoCreate? : boolean

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
export function getWorkDir(options?:WorkDirOptions):string{    
    const { location,autoCreate } = Object.assign({
        autoCreate:true
    }, options)
    try{
        // 从package.json/voerkai18n中读取
        const { entry } = getSettingsFromPackageJson(location) 
        const cwd = process.cwd()
        let langDir :string = ""
        if(entry){         
            langDir = path.isAbsolute(entry) ?  entry : path.join(cwd,entry)            
            if(autoCreate && !fs.existsSync(langDir)){
                fs.mkdirSync(langDir)
            }
        }else{        
            langDir = getDefaultWorkDir(options)
        }
        return langDir
    }catch(e){
        console.error("获取语言文件夹失败",e)
        return ""
    }
    
}
