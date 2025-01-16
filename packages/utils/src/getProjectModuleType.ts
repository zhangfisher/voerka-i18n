import { getPackageJson } from "flex-tools/package/getPackageJson"
 
/**
 * 获取当前项目的模块类型
 * 
 * 1. <package.json>.type="module"
 * 2. 当前工程的index.(js|ts)是否包含了import  xx from 
 * 3. 检查是否是typescript工程
 * 
 * 
 */

export function getProjectModuleType(srcPath:string,isTypeScript:boolean): "esm" | "cjs"{
     try{
        let packageJson = getPackageJson(srcPath)
        if( packageJson && packageJson.type=="module") return "esm"
    }catch{}
    return isTypeScript ? 'esm' : 'cjs'       
}
