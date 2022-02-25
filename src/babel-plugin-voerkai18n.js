/**
 *  转译源码中的t翻译函数的翻译内容转换为唯一的id值
 * 
 *  - 将源文件中的t("xxxxx")转码成t(hash(xxxxx))
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

module.exports = function voerkai18nPlugin(babel) {
    const t = babel.types;
    return {
        visitor:{ 
            CallExpression(path,state){      
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