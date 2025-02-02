/**
 * 在languages/.apikey.json中获取对应的API Key
 * 
 * .apikey.json文件格式如下：
 * {
 *  "baidu": {
 * 
 *   },
 *   "deepseek": {
 *     "appid": "xxxx",
 *   }
 * }
 * 
 * 
 * 之所有api key放在单独的文件中，是因为api key是敏感信息，不应该放在代码中
 * 所以应该在.gitignore中忽略这个文件
 * 
 */

import { getLanguageDir } from "./getLanguageDir"
import path from "node:path"
import fs from 'node:fs';

export function getApi<T extends Record<string,any> =Record<string,any>>(name:string,defaultValue?:Partial<T>):T | undefined{
    // 读取.apikey.json文件
    const langDir = getLanguageDir()
    const apikeyFile = path.join(langDir,"./api.json")
    if(fs.existsSync(apikeyFile)){                    
        const apikeys = JSON.parse(fs.readFileSync(apikeyFile,"utf-8"))
        return apikeys[name] || defaultValue  
    }
    return defaultValue as T
}