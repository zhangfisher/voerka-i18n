import { getPackageRootPath } from "flex-tools/package/getPackageRootPath"
import path from "node:path"
import fs from "node:fs"

/**
 * 根据当前输入的文件夹位置自动确定源码文件夹位置
 * 
 * - 如果没有指定，则取当前文件夹
 * - 如果指定是非绝对路径，则以当前文件夹作为base
 * - 查找pack
 * - 如果该文件夹中存在src，则取src下的文件夹
 * -
 * 
 * @param {*} location 
 * @returns 
 */
export function getProjectSourceFolder(location?:string){ 
    let projectRoot = getPackageRootPath(location)
    if(projectRoot){
        const srcPath = path.join(projectRoot,"src")
        if(fs.existsSync(srcPath)){
            projectRoot = srcPath
        }
    }    
    return projectRoot
}
