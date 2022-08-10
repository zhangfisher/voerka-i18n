
/**
 * 初始化指定项目的语言包
 */


const path = require("path")
const fs = require("fs")
const shelljs = require("shelljs")
const { t } = require("./i18nProxy")
const { findModuleType } = require("@voerkai18n/utils")
const createLogger = require("logsets")
const logger = createLogger()


function getLanguageList(langs,defaultLanguage){
    try{
        const available_languages = require("./available_languages")
        if(defaultLanguage in available_languages){
            return langs.map(lng=>{
                const langIndex = available_languages[defaultLanguage].findIndex(l=>l.name===lng)
                if(langIndex > -1 ){
                    return {
                        name:lng,
                        title:available_languages[defaultLanguage][langIndex].title 
                    }
                }else{                    
                    return {
                        name:lng,
                        title:lng 
                    }
                }                
            })   
        }else{
            return langs.map(lng=>({name:lng,title:lng}))
        }        
    }catch(e){
        return langs.map(lng=>({name:lng,title:lng}))
    }
}


module.exports = function(srcPath,{debug = true,languages=["zh","en"],defaultLanguage="zh",activeLanguage="zh",reset=false,installRuntime=true}={}){
    // 语言文件夹名称
    const  langPath = "languages"
    // 查找当前项目的语言包类型路径
    const lngPath = path.join(srcPath,langPath)
    if(!fs.existsSync(lngPath)){
        fs.mkdirSync(lngPath)
        if(debug) logger.log(t("创建语言包文件夹: {}"),lngPath)
    }

    // 创建settings.json文件
    const settingsFile = path.join(lngPath,"settings.json")
    if(fs.existsSync(settingsFile) && !reset){
        if(debug) logger.log(t("语言配置文件{}文件已存在，跳过创建。\n使用{}可以重新覆盖创建"),settingsFile,"-r")
        return 
    }
    const settings = {
        languages:getLanguageList(languages,defaultLanguage),
        defaultLanguage,
        activeLanguage,
        namespaces:{}
    }

    // 写入配置文件
    fs.writeFileSync(settingsFile,JSON.stringify(settings,null,4))
        
    if(debug) {
        logger.log(t("生成语言配置文件:{}"),"./languages/settings.json")
        logger.log(t("拟支持的语言：{}"),settings.languages.map(l=>l.name).join(","))
        logger.log(t("初始化成功,下一步："))
        logger.log(t(" - 编辑{}确定拟支持的语言种类等参数"),"languages/settings.json")
        logger.log(t(" - 运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")
        logger.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")
    } 
} 