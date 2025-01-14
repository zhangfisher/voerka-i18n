import fs from 'node:fs'
import path from 'node:path'
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

export function getProjectModuleType(srcPath:string,isTypeScript:boolean){

    // <package.json>.type="module"
    try{
        let packageJson = getPackageJson(srcPath)
        if(packageJson.type=="module") return "esm"
    }catch{}

    // 检查入口文件
    const importRegex = /import\s*.*\s*from\s*(["']).*\1/gm
    const extryFiels = [
        path.join(srcPath,"index.js"),
        path.join(srcPath,"src","index.js"),
        path.join(srcPath,"main.js"),
        path.join(srcPath,"src","main.js"),
    ]

    for(let file of extryFiels){
        try{
            const source = fs.readFileSync(file).toString()
            if(importRegex.test(source)){
                return 'esm'
            }            
        }catch{}
    }
    return isTypeScript ? 'esm' : 'cjs'       
}
