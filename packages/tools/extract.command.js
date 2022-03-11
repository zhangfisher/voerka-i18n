const { findModuleType } = require("./utils")
const path = require("path")
const fs = require("fs")
const gulp = require("gulp")
const createLogger = require("logsets")
const logger = createLogger()


module.exports = function(targetPath,options={}){
    let { filetypes,exclude} =  options
    if(!filetypes) filetypes = ["*.js","*.json","*.jsx","*.ts","*.tsx","*.vue","*.html"]
    if(!Array.isArray(filetypes)) filetypes = filetypes.split(",")
    const folders = filetypes.map(ftype=>{
        if(ftype.startsWith(".")) ftype = "*"+ftype
        if(!ftype.startsWith("*.")) ftype = "*."+ftype
        return path.join(targetPath,ftype)
    })
    folders.push(`!${path.join(targetPath,"languages")}`)
    folders.push(`!${path.join(targetPath,"node_modules")}`)
    folders.push(`!${path.join(targetPath,"**","node_modules","**")}`)
    // 排除文件夹
    console.log("exclude",exclude)
    if(!Array.isArray(exclude) && exclude){
        exclude = exclude.split(",")
    } 
    if(exclude){
        exclude.forEach(folder=>{
            folders.push(`!${path.join(targetPath,folder)}`)
        })
    }

    console.log(folders)


    //gulp.src(path.join(targetPath,"**/*.json"))
}