const path = require('path');
const fs = require('fs');
 
const { 
    getProjectRootFolder,
    getProjectLanguageFolder,
    readIdMapFile,
    replaceTranslateText,
    hasImportTranslateFunction,
    importTranslateFunction
} = require('@voerkai18n/utils')
   

function voerkaI18nLoader(content, map, meta) {
    const { autoImport,debug } =Object.assign({
        autoImport: false,              // 是否自动导入t函数
        debug:false                     // 输出一些调试信息
    },this.query || {}) 
    try{
        const projectPath = getProjectRootFolder(this.resourcePath)
        const lngPath = getProjectLanguageFolder(projectPath)
        if(debug){
            console.log("[voerkai18n-loader]",`source=${this.resourcePath}`)
        }        
        // 是否自动导入t函数
        if(autoImport && !hasImportTranslateFunction(content) ){
            content = importTranslateFunction(content, this.resourcePath , lngPath)
        }
        const idMap = readIdMapFile(projectPath)        
        return replaceTranslateText(content,idMap)     
    }catch(e){
        if(debug){
            console.error("[voerkai18n-loader]",this.resourcePath,e.stack)
        }
    }
    return content
}

module.exports = voerkaI18nLoader;
