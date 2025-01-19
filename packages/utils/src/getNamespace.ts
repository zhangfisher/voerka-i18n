import type { VoerkaI18nNamespaces } from '@voerkai18n/runtime'
import path from 'node:path'

/**
 * 
 * 返回filePath是否在nsPaths名称空间内
 * 
 * inNamespace("a/b/c/xxx.js","a/b")  == true
 * inNamespace("a/c/c/xxx.js","a/b")  == false
 * 
 * @param {*} filePath  文件路径
 * @param {*} nsPath  名称空间的路径
 * @returns 
 */
function inNamespace(filePath:string,nsPath:string){
    return !path.relative(nsPath,filePath).startsWith("..") 


}
/**
 * 
 * 输入一个namespaces配置，
 * const namespaces = {
 *   "a":"src/a",
 *   "b":["src/b","src/c"],
 *   "c":(file)=>file.startsWith("src/c")
 * }
 * 
 * 如果输入的文件在namespace指定的路径内，则返回namespace的名称
 * 
 * 
 * @param {*} file 
 * @param {*} options.namespaces  名称空间配置 {<name>:[path,...,path],<name>:path,<name>:(file)=>{}}
 */
 export function getFileNamespace(file:string,namespaces?:VoerkaI18nNamespaces):string{
    if(!namespaces) return "default"
    file = path.isAbsolute(file) ? file : path.join(process.cwd(),file)
    for(let [name,value] of Object.entries(namespaces)){
        if(typeof(value)=== 'function'){
            if(value(file)===true) return name
        }else{
            const paths = Array.isArray(value) ? value : [value]
            for(let nsPath of paths){
                nsPath = path.isAbsolute(nsPath) ? nsPath : path.join(process.cwd(),nsPath)
                if(inNamespace(file,nsPath)){
                    return name
                }
            }
        }
    }
    return "default"
}