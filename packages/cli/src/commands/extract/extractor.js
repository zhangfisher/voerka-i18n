const { t } = require("../../i18n");
const fastGlob = require("fast-glob");
const { getLanguageDir, getVoerkaI18nSettings, extractTranslates } = require("@voerkai18n/utils")
const logsets = require("logsets");
const path = require("path");
const fs = require("flex-tools/fs/nodefs");
const { readFile } = require('flex-tools/fs/nodefs');




async function extractTexts(settings){
    const { langDir, langRelDir } = settings
    const patterns = [
        "**/*.{js,jsx,ts,tsx,vue}",
        "!coverage",
        "!.pnpm",
        "!**/*.test.*",
        "!**/*.spec.*",
        "!.vscode",
        "!dist",
        "!**/*.d.ts",
        "!node_modules",
        "!"+langRelDir 
    ]
    if(Array.isArray(settings.patterns)){
        patterns.push(...settings.patterns)
    }
    if(Array.isArray(options.patterns)){
        patterns.push(...options.patterns)
    }

    const f = getNamespace(file,settings.namespaces)

    // export type TranslateNode = {
    //     text    : string
    //     rang    : Range
    //     args?   : string,
    //     options?: string
    // }  

    logsets.header(t("开始提取要翻译的文本"))
    logsets.log(t("- 提取范围: {}"),patterns.join(", "))    
    logsets.log(t("- 您可以通过修改{}文件的{}参数来调整提取范围"),`${langRelDir}/settings.json`,"patterns")
    logsets.log(t("- 通过{}参数增加文件匹配规则"),"--patterns")

    const files = await fastGlob(patterns,{
        cwd:process.cwd(),
        absolute:true
    })
    logsets.log(t("共找到{}个文件"),files.length)

    const tasks = logsets.tasklist()

    const results = []

    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            tasks.add("提取{}",relFile)
            const code = await readFile(file,{ encoding: "utf-8" }) 
            const result = await extractTranslates(code,{
                file:relFile,
                namespace:settings.namespace
            }) 
            if(result && result.length>0){
                results.push(...result)
            }            
            if(result.length === 0){
                tasks.skip()
            }else{
                tasks.complete(`共${result.length}个文本`)
            }
            
        }catch(e){
            tasks.error(e)
        }       
    }
    return results
}

/**
 * 读取当前项目中已经提取的语言配置
 * @param {*} settings 
 */
async function getTranslateTexts(settings){
    const { langDir, langRelDir } = settings
    

}

async function extractor(options){   

    const settings = await getVoerkaI18nSettings();
    settings.langDir = getLanguageDir()
    settings.langRelDir = path.relative(process.cwd(),settings.langDir).replaceAll(path.sep,"/")
 
    // 1. 提取文本


    // 2. 保存文本


}


module.exports = extractor
