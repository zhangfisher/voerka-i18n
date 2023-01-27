const path = require("path")
const fs = require("fs")
const { 
    fileMatcher,
    getProjectRootFolder,
    getProjectLanguageFolder,
    readIdMapFile,
    hasImportTranslateFunction,
    replaceTranslateText,
    importTranslateFunction
} = require("@voerkai18n/utils")



/**
   options = {
        location: "./languages",
        autoImport:true
   } 
  
 */
//const TranslateRegex = /\bt\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>[^\1]*?)(?=(\1\s*\))|(\1\s*\,))/gm
// 匹配t('xxxx')的正则表达式
const TranslateRegex =/(?<=\bt\(\s*("|'){1})(?<text>[^\1]*?)(?=(\1\s*\))|(\1\s*\,))/gm

module.exports = function VoerkaI18nPlugin(opts={}) {
    let options = Object.assign({
        location: "./",                                 // 指定当前工程目录
        autoImport: false,                              // 是否自动导入t函数
        debug:false,                                    // 是否输出调试信息，当=true时，在控制台输出转换匹配的文件清单
        patterns:[
            "!\.(svg|css|json|scss|less|sass)$", 
            "!(?<!.vue\?.*).(css|json|scss|less|sass)$",            // 排除所有css文件
            /\.vue(\?.*)?/,                                         // 所有vue文件
            "!(?<!.jsx\?.*).(css|json|scss|less|sass)$", 
            /\.jsx(\?.*)?/, 
            /\.ts(\?.*)?/, 
        ]                              // 提取范围
    },opts)
    
    let { debug,patterns,autoImport } = options



    let projectRoot = getProjectRootFolder(options.location)
    let languageFolder = getProjectLanguageFolder(projectRoot)        

    if(!fs.existsSync(languageFolder)){
        console.warn(`Voerkai18n语言文件夹不存在,@voerkai18n/vite未启用`)
    }
    if(debug){
        console.log("Project root: ",projectRoot)
        console.log("Language folder: ",languageFolder)
    }    

    const matcher = fileMatcher(patterns,{
        basePath:projectRoot,
        debug:debug
    })
    let idMap 
    try{
        idMap = readIdMapFile(options.location)
    }catch(e){
        console.warn("读取idMap.js文件失败，@voerkai18n/vite未启用")
        return
    }    
    
    return {
        name: 'voerkai18n',    
        async transform(src, id) {
            let [isMatched,pattern] = debug ? matcher.test(id) : [matcher.test(id),null]

            let extName = path.extname(id)
            // 当autoImport=true或者autoImport=[".js"]时需要自动导入
            let needImport = typeof(autoImport)=='boolean' ? autoImport : (
                Array.isArray(autoImport) ? (
                    autoImport.includes(extName) || autoImport.includes(`.${extName}`)
                ) : false
            )

            if(isMatched){
                if(debug){
                    console.log(`[VoerkaI18n] File=${path.relative(projectRoot,id)}, pattern=[${pattern}], import from "${path.relative(path.dirname(id),languageFolder)}"`)            
                }
                try{
                    // 判断是否使用了t函数
                    if(TranslateRegex.test(src)){
                        let code = replaceTranslateText(src,idMap)
                        // 如果没有导入t函数，则尝试自动导入
                        if(needImport && !hasImportTranslateFunction(code)){       
                            code = importTranslateFunction(code,id,languageFolder)                  
                        }                        
                        return {
                            code,
                            map: null  
                        }
                    }
                }catch(e){
                    console.warn(`[voerkai18n]转换<${id}>文件出错:${e.message}`)
                }
            }            
            return {
                code:src,
                map: null  
              }
        }
      }
}
