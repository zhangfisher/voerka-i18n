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