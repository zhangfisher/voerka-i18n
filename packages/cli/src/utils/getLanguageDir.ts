/**
 *
 * 获取VoerkaI18n语言文件夹
 * 
 */

import { getSettingsFromPackageJson } from "./getSettingsFromPackageJson"
import fs from "node:fs"
import path from "node:path" 


/**
 * 
 * 获取语言文件夹
 * 
 * - 读取package.json中的voerkai18n字段
 * 
 * @returns 
 * 
 */
export function getLanguageDir(){    
    // 从package.json/voerkai18n中读取
    let { entry } = getSettingsFromPackageJson(location)

    // 绝对路径    
    if(!path.isAbsolute(location)){   
        location = path.join(process.cwd(),location)
    }    
    // 发现当前项目根目录
    const searchFolders = [
        path.join(location,"src",entry),
        path.join(location,entry)
    ]

    for(let folder of searchFolders){
        if(fs.existsSync(folder)){
            return folder
        }
    }     
    return path.join(process.cwd(),'languages')
}
