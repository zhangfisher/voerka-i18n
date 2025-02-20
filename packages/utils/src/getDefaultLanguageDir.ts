/**
 *
 * 获取VoerkaI18n语言文件夹
 * 
 */

import fs from "node:fs"
import path from "node:path" 
import { getExistedDir } from "flex-tools/fs/getExistedDir"
import { LanguagesDirOptions } from "./getLanguageDir"

 
/**
 * 
 * 获取语言文件夹
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
export function getDefaultLanguageDir(options?:LanguagesDirOptions):string{    
    const { location,autoCreate } = Object.assign({
        autoCreate:false
    }, options)
    try{ 
        const cwd = process.cwd()
        let langDir :string = ""         
        const srcPath = cwd         
        const existedLangDir = getExistedDir([
            path.join(srcPath,"languages"),
            path.join(cwd,"languages")
        ])
        if(existedLangDir){
            langDir = existedLangDir
        }else{
            langDir = path.join(srcPath,"languages")
        } 
        if(autoCreate && !fs.existsSync(langDir)){
            fs.mkdirSync(langDir)
        }
        return langDir
    }catch(e){ 
        return "src/languages"
    } 
}
