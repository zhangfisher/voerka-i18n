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
 *      hashId = getMessageId()
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

const readJson = require("readjson")
const glob  = require("glob")
const createLogger = require("logsets") 
const path = require("path")
const { getMessageId } = require("./utils")
const fs = require("fs")
const logger = createLogger() 
const artTemplate = require("art-template")

function normalizeCompileOptions(opts={}) {
    let options = Object.assign({
        input:null,                                    // 指定要编译的文件夹，即extract输出的语言文件夹
        output:null,                                   // 指定编译后的语言文件夹,如果没有指定，则使用input目录
        formatters:{},                                 // 对插值变量进行格式化的函数列表
    }, opts)
    return opts;
}

module.exports = function compile(langFolder,opts={}){
    let options = normalizeCompileOptions(opts);
    let { output } = options; 
    
    //1.  加载多语言配置文件
    import(`file:///${path.join(langFolder,"settings.js")}`).then(module=>{
        let { languages,defaultLanguage,activeLanguage,namespaces }  = module.default;
  
        // 1. 合并生成最终的语言文件
        let messages = {} ,msgId =1 
        glob.sync(path.join(langFolder,"translates/*.json")).forEach(file=>{
            try{
                let msg = readJson.sync(file)
                Object.entries(msg).forEach(([msg,langs])=>{
                    if(msg in messages){
                        Object.assign(messages[msg],langs)
                    }else{
                        messages[msg] = langs
                    } 
                }) 
            }catch(e){
                logger.log("读取语言文件{}失败:{}",file,e.message)
            }
        })
        // 2. 为每一个文本内容生成一个唯一的id
        let messageIds = {}
        Object.entries(messages).forEach(([msg,langs])=>{
            langs.$id = msgId++
            messageIds[msg] = langs.$id
        })
        // 3. 为每一个语言生成对应的语言文件
        languages.forEach(lang=>{
            let langMessages = {}   
            Object.entries(messages).forEach(([message,translatedMsgs])=>{ 
                langMessages[translatedMsgs.$id] = lang.name in translatedMsgs ? translatedMsgs[lang.name] : message
            })
            // 为每一种语言生成一个语言文件
            fs.writeFileSync(path.join(langFolder,`${lang.name}.js`),`export default ${JSON.stringify(langMessages,null,4)}`)
        })
        
        // 4. 生成id映射文件
        fs.writeFileSync(path.join(langFolder,"messageIds.js"),`export default ${JSON.stringify(messageIds,null,4)}`)
 
        const hasFormatters = fs.existsSync(path.join(langFolder,"formatters.js")) 
        // 生成编译后的访问入口文件
        const entryContent = artTemplate(path.join(__dirname,"entry.template.js"), {languages,defaultLanguage,activeLanguage,namespaces } )
        fs.writeFileSync(path.join(langFolder,"index.js"),entryContent)

    })
    

}