const path = require("path")
const fs = require("fs")
const { fileMatcher,getProjectRootFolder,getProjectLanguageFolder } = require("@voerkai18n/utils")

//const TranslateRegex = /\bt\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>[^\1]*?)(?=(\1\s*\))|(\1\s*\,))/gm

const TranslateRegex =/(?<=\bt\(\s*("|'){1})(?<text>[^\1]*?)(?=(\1\s*\))|(\1\s*\,))/gm

// 匹配正则表达式
const importTRegex = /^[^\w\r\n\s]*import\s*\{(.*)\bt\b(.*)\}\s*from/gm


/**
 * 读取idMap.js文件
 * 
 * 
 * 
 * @param {*} options 
 * @returns 
 */
 function readIdMapFile(options){
    let { location } = options
    let searchIdMapFiles = []
    if(!path.isAbsolute(location)){
        location =  path.join(process.cwd(),location)
    }
    searchIdMapFiles.push(path.join(location,"src","languages/idMap.js"))
    searchIdMapFiles.push(path.join(location,"languages/idMap.js"))
    searchIdMapFiles.push(path.join(location,"idMap.js"))

    searchIdMapFiles.push(path.join(location,"src","languages/idMap.ts"))
    searchIdMapFiles.push(path.join(location,"languages/idMap.ts"))
    searchIdMapFiles.push(path.join(location,"idMap.ts"))

    let projectRoot = getProjectRootFolder(location)        
    searchIdMapFiles.push(path.join(projectRoot,"src","languages/idMap.js"))
    searchIdMapFiles.push(path.join(projectRoot,"languages/idMap.js"))
    searchIdMapFiles.push(path.join(projectRoot,"idMap.js"))
        
    searchIdMapFiles.push(path.join(projectRoot,"src","languages/idMap.ts"))
    searchIdMapFiles.push(path.join(projectRoot,"languages/idMap.ts"))
    searchIdMapFiles.push(path.join(projectRoot,"idMap.ts"))

    let idMapFile
    for( idMapFile of searchIdMapFiles){
        // 如果不存在idMap文件，则尝试从location/languages/中导入
        if(fs.existsSync(idMapFile)){ 
            try{
                // 由于idMap.js可能是esm或cjs，并且babel插件不支持异步
                // 当require(idMap.js)失败时，对esm模块尝试采用直接读取的方式
                return require(idMapFile)
            }catch(e){
                // 出错原因可能是因为无效require esm模块，由于idMap.js文件格式相对简单，因此尝试直接读取解析
                try{
                    let idMapContent = fs.readFileSync(idMapFile).toString()
                    idMapContent = idMapContent.trim().replace(/^\s*export\s*default\s/g,"")
                    return JSON.parse(idMapContent)
                }catch{ }                        
            }
        }
    }
    // 所有尝试完成后触发错误
    throw new Error(`${idMapFile}文件不存在,无法对翻译文本进行转换。\n原因可能是babel-plugin-voerkai18n插件的location参数未指向有效的语言包所在的目录。`)

}


function replaceCode(code, idmap) {
    return code.replaceAll(TranslateRegex, (message) => {
        if(message in idmap) {
            return idmap[message]
        }else{
            const msg = unescape(message.replaceAll("\\u","%u"))
            return msg in idmap ? idmap[msg] : message
        }
    })
}
 
/**
 * 判定代码中是否导入了Translate函数
 * @param {*} code 
 * @returns 
 */
function hasImportTranslateFunction(code){
    return importTRegex.test(code)
}

/**
   options = {
        location: "./languages",
        autoImport:true
   } 
  
 */
module.exports = function VoerkaI18nPlugin(opts={}) {
    let options = Object.assign({
        location: "./",                                 // 指定当前工程目录
        autoImport: true,                               // 是否自动导入t函数
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
        idMap = readIdMapFile(options)
    }catch(e){
        console.warn("读取idMap.js文件失败，@voerkai18n/vite未启用")
        return
    }    
    
    return {
        name: 'voerkai18n',    
        async transform(src, id) {
            let [isMatched,pattern] = debug ? matcher.test(id) : [matcher.test(id),null]
            if(isMatched){
                if(debug){
                    console.log(`File=${path.relative(projectRoot,id)}, pattern=[${pattern}], import from "${path.relative(path.dirname(id),languageFolder)}"`)            
                }
                try{
                    // 判断是否使用了t函数
                    if(TranslateRegex.test(src)){
                        let code = replaceCode(src,idMap)
                        // 如果没有导入t函数，则尝试自动导入
                        if(autoImport && !hasImportTranslateFunction(code)){
                            let importSource = path.relative(path.dirname(id),languageFolder)
                            if(!importSource.startsWith(".")){
                                importSource = "./" + importSource
                            }
                            importSource=importSource.replace("\\","/")
                            const extName = path.extname(id)
                            // 转换Vue文件
                            if(extName==".vue"){
                                // 优先在<script setup></script>中导入
                                const setupScriptRegex = /(^\s*\<script.*\s*setup\s*.*\>)/gmi
                                if(setupScriptRegex.test(code)){
                                    code = code.replace(setupScriptRegex,`$1\nimport { t } from '${importSource}';`)
                                }else{// 如果没有<script setup>则在<script></script>中导入
                                    code = code.replace(/(^\s*\<script.*\>)/gmi,`$1\nimport { t } from '${importSource}';`)
                                }
                            }else if(['.js','.ts'].includes(extName)){// 普通js/ts文件需要添加到最前面
                                code = code = `import { t } from '${importSource}';\n${code}`
                            }                            
                        }
                        return {
                            code,
                            map: null  
                        }
                    }
                }catch(e){
                    console.warn(`vite-plugin-voerkai18n转换<${id}>文件出错:${e.message}`)
                }
            }            
            return {
                code:src,
                map: null  
              }
        }
      }
}
