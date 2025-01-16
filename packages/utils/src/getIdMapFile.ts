import fs from "node:fs"
import path from "node:path"
import { getSettingsFromPackageJson } from "./getSettingsFromPackageJson"
import { getPackageRootPath } from "flex-tools/package/getPackageRootPath"


/**
 * 读取当前工程下languages/idMap.(js|ts)文件 
 * 
 * @param {*} location  项目根文件夹或者当前项目下的任意一个文件夹 
 * @returns 
 */
export function getIdMap(location:string="./"){

    const { entry='languages' }  = getSettingsFromPackageJson(location)
    if(!path.isAbsolute(location)){
        location =  path.join(process.cwd(),location)
    }

    let searchIdMapFiles = [
        path.join(location,"src",`${entry}/idMap.js`),
        path.join(location,`${entry}/idMap.js`),
        path.join(location,"idMap.js"),
        path.join(location,"src",`${entry}/idMap.ts`),
        path.join(location,`${entry}/idMap.ts`),
        path.join(location,"idMap.ts")
    ]
    let projectRoot = getPackageRootPath(location)      
    if(projectRoot){
        searchIdMapFiles.push(path.join(projectRoot,"src",`${entry}/idMap.js`))
        searchIdMapFiles.push(path.join(projectRoot,`${entry}/idMap.js`))
        searchIdMapFiles.push(path.join(projectRoot,"idMap.js"))            
        searchIdMapFiles.push(path.join(projectRoot,"src",`${entry}/idMap.ts`))
        searchIdMapFiles.push(path.join(projectRoot,`${entry}/idMap.ts`))
        searchIdMapFiles.push(path.join(projectRoot,"idMap.ts"))
    }    

    let idMapFile
    for( idMapFile of searchIdMapFiles){
        // 如果不存在idMap文件，则尝试从location/languages/中导入
        if(fs.existsSync(idMapFile)){ 
            try{
                // 由于idMap.js可能是esm或cjs，并且babel插件不支持异步
                // 当require(idMap.js)失败时，对esm模块尝试采用直接读取的方式
                return require(idMapFile)
            }catch(e){
                // 出错原因可能是因为无效require esm模块，由于idMap.js文件格式相对简单，因此尝试直接读取解析
                try{
                    let idMapContent = fs.readFileSync(idMapFile).toString()
                    idMapContent = idMapContent.trim().replace(/^\s*export\s*default\s/g,"")
                    return JSON.parse(idMapContent)
                }catch{ }                        
            }
        }
    }
    throw new Error(`${idMapFile}文件不存在,无法对翻译文本进行转换。`) 
}
