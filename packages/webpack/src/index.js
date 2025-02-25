const path = require('path');
const fs = require('fs');
 
const {  
    getLanguageDir,
    applyIdMap
} = require('@voerkai18n/utils')
   
const langDir = getLanguageDir()
const idMapFile = path.join(langDir, 'idMap.json')

function voerkaI18nLoader(content) {
    const { autoImport,debug } =Object.assign({
        autoImport: false,                      // 是否自动导入t函数
        debug     : false                       // 输出一些调试信息
    },this.query || {}) 
    try{
        const langDir = getLanguageDir()

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
        console.error("[voerkai18n-loader]",this.resourcePath,e.stack)
    }
    return content
}

module.exports = voerkaI18nLoader;
