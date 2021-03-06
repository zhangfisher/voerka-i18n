const { findModuleType } = require("@voerkai18n/utils")
const { t } = require("./i18nProxy")
const path = require("path")
const fs = require("fs")
const gulp = require("gulp")
const extractor = require("./extract.plugin")
const createLogger = require("logsets")
const logger = createLogger()


module.exports = function(srcPath,options={}){
    let { filetypes,exclude} =  options
    if(!filetypes) filetypes = ["*.js","*.jsx","*.ts","*.tsx","*.vue","*.html"]
    if(!Array.isArray(filetypes)) filetypes = filetypes.split(",")
    const folders = filetypes.map(ftype=>{
        if(ftype.startsWith(".")) ftype = "*"+ftype
        if(!ftype.startsWith("*.")) ftype = "*."+ftype
        return path.join(srcPath,"**",ftype)
    })
    folders.push(`!${path.join(srcPath,"languages","**")}`)
    folders.push(`!${path.join(srcPath,"node_modules","**")}`)
    folders.push(`!${path.join(srcPath,"**","node_modules","**")}`)
    folders.push("!**/babel.config.js")
    folders.push("!**/gulpfile.js")
    folders.push("!**/*.test.js")
    folders.push("!__test__/**/*.js")
    folders.push("!**/vite.config.js")
    

    if(!Array.isArray(exclude) && exclude){
        exclude = exclude.split(",")
    } 
    if(exclude){
        exclude.forEach(folder=>{
            folders.push(`!${path.join(srcPath,folder)}`)
        })
    } 
    if(!fs.existsSync(srcPath)){
        logger.log(t("目标文件夹<{}>不存在"),srcPath)
        return 
    }
    if(options.debug){
        logger.log(t("扫描提取范围："))
        logger.format(folders)
    }

    options.outputPath = path.join(srcPath,"languages")
    gulp.src(folders)
        .pipe(extractor(options))
        .pipe(gulp.dest(options.outputPath))
}