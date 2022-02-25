/**
 * 将extract插件扫描的文件编译为语言文件
 * 
 * 编译后的语言文件用于运行环境使用
 * 
 * 编译原理如下：
 * 
 * 
 * 编译输出:
 *      
 *      hashId = hash([projectName]_[namespace]_[message])
 *       
 *    - languages/index.js    主源码，用来引用语言文件
 *      {
 *          languages:{},

 *      }
 *    - languages/messageIds.json   翻译文本的id映射表
 *      {
 *          [msg]:"<id>"
 *      } 
 *    - languages/en.js       英文语言文件
 *       {
 *          [region]:{
 *              [namespace]:{
 *                  [hashId]:"<message>",
 *              },
 *              [namespace]:{...},         
 *         },
 *          [region]:{...}
 *       }     
 * 
 *    - languages/[lang].js   语言文件 
 *    - formaters.js
 * 
 * @param {*} opts 
 */

function normalizeCompileOptions(opts={}) {
    let options = Object.assign({
        input:null,                                    // 指定要编译的文件夹，即extract输出的语言文件夹
        output:null,                                   // 指定编译后的语言文件夹,如果没有指定，则使用input目录
        formatters:{},                                 // 对插值变量进行格式化的函数清单
    }, opts)
    return opts;
}

module.exports = function compile(opts={}){

}