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
        moduleType:"esm"                               // 指定编译后的语言文件的模块类型，取值common,cjs,esm,es
    }, opts)
    if(options.moduleType==="es") options.moduleType = "esm"
    if(options.moduleType==="cjs") options.moduleType = "common"
    if(["common","cjs","esm","es"].includes(options.moduleType))  options.moduleType = "esm"
    return opts;
}

module.exports = function compile(langFolder,opts={}){
    const options = normalizeCompileOptions(opts);
    const { output,moduleType } = options; 
    
    //1.  加载多语言配置文件
    import(`file:///${path.join(langFolder,"settings.js")}`).then(module=>{
        const langSettings = module.default;
        let { languages,defaultLanguage,activeLanguage,namespaces }  = langSettings
  
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
            const langFile = path.join(langFolder,`${lang.name}.js`)
            // 为每一种语言生成一个语言文件
            if(moduleType==="esm"){
                fs.writeFileSync(langFile,`export default ${JSON.stringify(langMessages,null,4)}`)
            }else{
                fs.writeFileSync(langFile,`module.exports = ${JSON.stringify(langMessages,null,4)}`)
            } 
        })
        
        // 4. 生成id映射文件
        const idMapFile = path.join(langFolder,"idMap.js")
        if(moduleType==="esm"){
            fs.writeFileSync(idMapFile,`export default ${JSON.stringify(messageIds,null,4)}`)
        }else{
            fs.writeFileSync(idMapFile,`module.exports = ${JSON.stringify(messageIds,null,4)}`)
        }

        // 5. 生成编译后的访问入口文件
        const entryFile = path.join(langFolder,"index.js")
        const entryContent = artTemplate(path.join(__dirname,"templates","entry.js"), {languages,defaultLanguage,activeLanguage,namespaces,moduleType } )
        fs.writeFileSync(entryFile,entryContent)
        
        // 6 . 生成编译后的格式化函数文件
        const formattersFile =  path.join(langFolder,"formatters.js") 
        if(!fs.existsSync(formattersFile)){
            const formattersContent = artTemplate(path.join(__dirname,"templates","formatters.js"), {languages,defaultLanguage,activeLanguage,namespaces,moduleType } )
            fs.writeFileSync(formattersFile,formattersContent)
        } 
    })
}