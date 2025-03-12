import { getPackageRootPath } from "flex-tools/package/getPackageRootPath"
import path from "node:path"
import fs from "node:fs"


/**
 * 将指定的文件或文件模式添加到项目的.gitignore文件中
 * 如果.gitignore文件不存在，会先创建一个空的.gitignore文件
 * 
 * @param files 要添加到.gitignore中的文件或文件模式，可以是单个字符串或字符串数组
 */
export function addToGitIgnore(files:string | string[]){
    // 获取项目根目录路径
    const projectRoot = getPackageRootPath() || process.cwd()
    // 构建.gitignore文件的绝对路径
    const gitignoreFile = path.resolve(projectRoot,'.gitignore')
    // 如果.gitignore文件不存在，则创建一个空的.gitignore文件
    if(!fs.existsSync(gitignoreFile)){
        fs.writeFileSync(gitignoreFile,'')
    }
    // 读取.gitignore文件的内容
    const content = fs.readFileSync(gitignoreFile).toString()
    // 将内容按行分割成数组
    const lines = content.split('\n')
    // 确保files参数总是数组形式
    const newLines = Array.isArray(files) ? files : [files]
    // 遍历要添加的文件或文件模式
    newLines.forEach(file=>{
        // 如果.gitignore中已存在，则跳过
        if(lines.includes(file)){
            return
        }
        // 否则，添加到lines数组中
        lines.push(file)
    })
    // 将更新后的内容写回.gitignore文件
    fs.writeFileSync(gitignoreFile,lines.join('\n'))
}