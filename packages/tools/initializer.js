
/**
 * 初始化指定项目的语言包
 */


const { findModuleType } = require("./utils")
const path = require("path")
const fs = require("fs")
const createLogger = require("logsets")
const logger = createLogger()

module.exports = function(targetPath,{debug = true, langPath = "languages",languages=["cn","en"],defaultLanguage="cn",activeLanguage="cn",moduleType = "auto",reset=false}={}){
    // 查找当前项目的语言包类型路径
    if(moduleType==="auto"){
        moduleType = findModuleType(targetPath)
    }
    if(moduleType==null) {
        if(debug){
            logger.log("找不到{}文件,{}只能在js项目工程中使用","package.json","voerkai18n")
        }else{
            throw new Error("找不到package.json文件,voerkai18n只能在js项目工程中使用")
        }        
    }

    const lngPath = path.join(targetPath,langPath)
    if(!fs.existsSync(lngPath)){
        fs.mkdirSync(lngPath)
        if(debug) logger.log("创建语言包文件夹: {}",lngPath)
    }

    // 创建settings.js文件
    const settingsFile = path.join(lngPath,"settings.js")
    if(fs.existsSync(settingsFile) && !reset){
        if(debug) logger.log("语言配置文件{}文件已存在，跳过创建。\n使用{}可以重新覆盖创建",settingsFile,"-r")
        return 
    }
    const settings = {
        languages:languages.map(lng=>({name:lng,title:lng})),
        defaultLanguage,
        activeLanguage,
        namespaces:{}
    }
    if(["esm","es"].includes(moduleType)){
        fs.writeFileSync(settingsFile,`export default ${JSON.stringify(settings,null,4)}`)
    }else{
        fs.writeFileSync(settingsFile,`module.exports = ${JSON.stringify(settings,null,4)}`)
    }

    if(debug) logger.log("创建语言配置文件<{}>成功",settingsFile)
}