import { getPackageRootPath } from "flex-tools/package/getPackageRootPath"
import path from "node:path"
import fs from "node:fs"

/**
 * 
 *获取当前项目的根目录 
 * 
 * @param {*} location 
 * @returns 
 */
export function getProjectRoot(location?:string){ 
    const cwd = process.env.INIT_CWD || process.cwd()
    let projectRoot = cwd || getPackageRootPath(location)
    if(projectRoot){
        const srcPath = path.join(projectRoot,"src")
        if(fs.existsSync(srcPath)){
            projectRoot = srcPath
        }
    }    
    return projectRoot
}
