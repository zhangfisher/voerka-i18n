/**
 *  转译源码中的t翻译函数的翻译内容转换为唯一的id值
 * 
 *  - 将源文件中的t("xxxxx")转码成t("id")
 *  - 自动导入languages/index.js中的翻译函数t
 * 
 *  查看AST: https://astexplorer.net/
 *  Babel插件手册: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
 * 
 *  使用方法:
 * 
 * {
 *  plugins:[
 *      ["voerkai18n",{
 *          location:"./languages",
 *          autoImport:"./languages",   
 *          moduleType:"esm" 
 *      }]
 *  ]
 * 
 * 
 * 
 * }
 * 
 * 
 * 
 */

const fs =  require("fs");
const pathobj =  require("path");
const { getProjectRootFolder, getSettingsFromPackageJson } = require("@voerkai18n/utils")


const DefaultI18nPluginOptions = {
    translateFunctionName:"t",          // 默认的翻译函数名称
    // 翻译文件存放的目录，即编译后的语言文件的文件夹
    // 默认从当前目录下的languages文件夹中导入 
    location:"./",
    // 自动创建import {t} from "#/languages"  或  const { t } = require("#/languages")  
    // 如果此值是空，则不会自动创建import语句    
    autoImport:"#/languages",       
    // 自动导入时t函数时使用require或import,取值为 auto,require,import
    // auto时会判断是否存在import语句，如果存在则使用import，否则使用require
    // 也可以指定为require或import，主要用于测试时使用
    moduleType:"auto",                          
    // 存放翻译函数的id和翻译内容的映射关系,此参数用于测试使用
    // 正常情况下会读取<location>/idMap.js文件
    idMap:{}                            
}


/**
 * 判断当前是否是一个esmodule，判断依据是
 * - 包含import语句
 * - 包含export语句
 
 * @param {*} path 
 */
function isEsModule(path){
    for(let ele of path.node.body){
        if(ele.type==="ImportDeclaration" || ele.type==="ExportNamedDeclaration" || ele.type==="ExportDefaultDeclaration"){
            return true
        }
    } 
}
/**
 * 判断是否导入了翻译函数 
 * import { t } from "./i18n"
 * const { t }  form "./languages"
 * @param {*} path 
 * @returns  
 */
function hasImportTranslateFunction(path){  
    for(let ele of path.node.body){
        if(ele.type==="ImportDeclaration"){ 
            if(Array.isArray(ele.specifiers) && ele.specifiers.findIndex(s => (s.type === "ImportSpecifier")  && (s.imported.name ==this.translateFunctionName) && (s.local.name===this.translateFunctionName))>-1){               
                return true
            }
        }
    }
}
function hasRequireTranslateFunction(path){ 
    for(let ele of path.node.body){
        if(ele.type==="VariableDeclaration"){ 
            if(Array.isArray(ele.specifiers) && ele.specifiers.findIndex(s => s.type === "ImportSpecifier"  && s.imported.name ==this.translateFunctionName && s.local.name===this.translateFunctionName)>-1){
                return true
            }
        }
    }
}


/**
 * 读取idMap.js文件
 * @param {*} options 
 * @returns 
 */
function readIdMapFile(options){
    let { idMap,location ,entry ='languages'} = options
    if(typeof(idMap)==="object" && Object.keys(idMap).length>0){
        return idMap
    }else{
        let searchIdMapFiles = []
        if(!pathobj.isAbsolute(location)){
            location =  pathobj.join(process.cwd(),location)
        }
        searchIdMapFiles.push(pathobj.join(location,"src",`${entry}/idMap.js`))
        searchIdMapFiles.push(pathobj.join(location,`${entry}/idMap.js`))
        searchIdMapFiles.push(pathobj.join(location,"idMap.js"))

        searchIdMapFiles.push(pathobj.join(location,"src",`${entry}/idMap.ts`))
        searchIdMapFiles.push(pathobj.join(location,`${entry}/idMap.ts`))
        searchIdMapFiles.push(pathobj.join(location,"idMap.ts"))

        let projectRoot = getProjectRootFolder(location)        
        searchIdMapFiles.push(pathobj.join(projectRoot,"src",`${entry}/idMap.js`))
        searchIdMapFiles.push(pathobj.join(projectRoot,`${entry}/idMap.js`))
        searchIdMapFiles.push(pathobj.join(projectRoot,"idMap.js"))

        searchIdMapFiles.push(pathobj.join(projectRoot,"src",`${entry}/idMap.ts`))
        searchIdMapFiles.push(pathobj.join(projectRoot,`${entry}/idMap.ts`))
        searchIdMapFiles.push(pathobj.join(projectRoot,"idMap.ts"))

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
}

module.exports = function voerkai18nPlugin(babel) {
    const t = babel.types;
    const pluginOptions = Object.assign({},DefaultI18nPluginOptions);
    const pkgLangSettings = getSettingsFromPackageJson()
    let idMap = {}
    return {
        visitor:{ 
            Program(path, state){ 
                // 转码插件参数可以覆盖默认参数
                Object.assign(pluginOptions,state.opts || {},pkgLangSettings); 
                const { location ,autoImport, translateFunctionName,moduleType } = pluginOptions
                if(Object.keys(idMap).length===0){
                    idMap = readIdMapFile(pluginOptions) 
                }                
                // 是否自动导入t函数
                if(autoImport){
                    let module = moduleType === 'auto' ? isEsModule(path) ? 'esm' : 'cjs' : moduleType
                    if(!["esm","es","cjs","commonjs"].includes(module)) module = 'esm'
                    if(module === 'esm'){
                        //  如果没有定义t函数，则自动导入
                        if(!hasImportTranslateFunction.call(pluginOptions, path)){       
                            path.node.body.unshift(t.importDeclaration([
                                t.ImportSpecifier(t.identifier(translateFunctionName),t.identifier(translateFunctionName)
                            )],t.stringLiteral(autoImport)))
                        }
                    }else{
                        if(!hasRequireTranslateFunction.call(pluginOptions, path)){ 
                            path.node.body.unshift(t.variableDeclaration("const",[
                                t.variableDeclarator(
                                    t.ObjectPattern([t.ObjectProperty(t.Identifier(translateFunctionName),t.Identifier(translateFunctionName),false,true)]),
                                    t.CallExpression(t.Identifier("require"),[t.stringLiteral(autoImport)])
                                )
                            ]))
                        }                    
                    }   
                }                              
            },
            // 将t函数的第一个参数转换为id
            CallExpression(path,state){    
                if( path.node.callee.name === pluginOptions.translateFunctionName ){
                    if(path.node.arguments.length>0 && t.isStringLiteral(path.node.arguments[0])){
                        let message = path.node.arguments[0].value 
                        const msgId =(message in idMap) ? idMap[message] : message
                        path.node.arguments[0] = t.stringLiteral(String(msgId))
                    } 
                }else{
                    path.skip();  
                }
            } 
        }
    }
}