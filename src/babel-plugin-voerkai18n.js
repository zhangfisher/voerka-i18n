/**
 *  转译源码中的t翻译函数的翻译内容转换为唯一的id值
 * 
 *  - 将源文件中的t("xxxxx")转码成t(hash(xxxxx))
 *  - 自动导入languages/index.js中的翻译函数t
 *  
 *  使用方法:
 * 
 * {
 *  plugins:[
 *      ["voerkai18n",{}]
 *  ]
 * 
 * }
 * 
 * 
 * 
 */

const { getMessageId } = require('./utils'); 
const TRANSLATE_FUNCTION_NAME = "t"
const fs =  require("fs");

const DefaultI18nPluginOptions = {
    translateFunctionName:"t",          // 默认的翻译函数名称
    location:"./languages"              // 默认的翻译文件存放的目录，即编译后的语言文件的文件夹
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
            if(ele.specifiers.findIndex(s => s.type === "ImportSpecifier"  && s.imported.name ==TRANSLATE_FUNCTION_NAME && s.local.name===TRANSLATE_FUNCTION_NAME)>-1){
                return true
            }
        }
    }
}
function hasRequireTranslateFunction(path){ 
    for(let ele of path.node.body){
        if(ele.type==="VariableDeclaration"){ 
            if(ele.specifiers.findIndex(s => s.type === "ImportSpecifier"  && s.imported.name ==TRANSLATE_FUNCTION_NAME && s.local.name===TRANSLATE_FUNCTION_NAME)>-1){
                return true
            }
        }
    }
}
module.exports = function voerkai18nPlugin(babel) {
    const t = babel.types;
    const pluginOptions = Object.assign({},DefaultI18nPluginOptions);
    return {
        visitor:{ 
            Program(path, state){ 
                Object.assign(pluginOptions,state.opts || {}); 
                const { location = "./languages", translateFunctionName } = pluginOptions
                if(isEsModule(path)){
                    //  如果没有定义t函数，则自动导入
                    if(!hasImportTranslateFunction(path)){       
                        path.node.body.unshift(t.importDeclaration([
                            t.ImportSpecifier(t.identifier(translateFunctionName),t.identifier(translateFunctionName)
                        )],t.stringLiteral(location)))
                    }
                }else{
                    if(!hasRequireTranslateFunction(path)){ 
                        path.node.body.unshift(t.variableDeclaration("const",[
                            t.variableDeclarator(
                                t.ObjectPattern([t.ObjectProperty(t.Identifier(translateFunctionName),t.Identifier(translateFunctionName),false,true)]),
                                t.CallExpression(t.Identifier("require"),[t.stringLiteral(location)])
                            )
                        ]))
                    }                    
                }                
            },
            CallExpression(path,state){      
                let options = state.opts 
                // 只对翻译函数进行转码   
                if(path.node.callee.name===TRANSLATE_FUNCTION_NAME){
                    if(path.node.arguments.length>0 && t.isStringLiteral(path.node.arguments[0])){
                        let text = path.node.arguments[0].value 
                        path.node.arguments[0] = t.stringLiteral(`*${text}*`)
                    } 
                }else{
                    path.skip();  
                }
            } 
        }
    }
}