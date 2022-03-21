/**
 * 将extract插件扫描的文件编译为语言文件
 * 
 * 编译后的语言文件用于运行环境使用
 * 
 * 编译原理如下：
 * 
 * 
 * 编译后会在目标文件夹输出:
 *    
 *    - languages
 *        translates
 *          - en.json
 *          - cn.json
 *          - ...
 *       idMap.js                    // id映射列表
 *       settings.js                 // 配置文件
 *       cn.js                       // 中文语言包
 *       en.js                       // 英文语言包
 *       [lang].js                   // 其他语言包
 *       package.json                // 包信息，用来指定包类型，以便在nodejs中能够正确加载
 * 
 * @param {*} opts 
 */

const readJson = require("readjson")
const glob  = require("glob")
const createLogger = require("logsets") 
const path = require("path")
const { t,importModule,findModuleType,getCurrentPackageJson} = require("./utils")
const fs = require("fs")
const logger = createLogger() 
const artTemplate = require("art-template")
 
function normalizeCompileOptions(opts={}) {
    let options = Object.assign({
        moduleType:"auto"                               // 指定编译后的语言文件的模块类型，取值common,cjs,esm,es
    }, opts)
    if(options.moduleType==="es") options.moduleType = "esm"
    if(options.moduleType==="cjs") options.moduleType = "commonjs"
    if(!["auto","commonjs","cjs","esm","es"].includes(options.moduleType))  options.moduleType = "esm"
    return options;
}

module.exports =async  function compile(langFolder,opts={}){
    const options = normalizeCompileOptions(opts);
    let { moduleType } = options; 
    
    if(moduleType==="auto"){
        moduleType = findModuleType(langFolder)
    }
    const projectPackageJson = getCurrentPackageJson(langFolder)
    // 加载多语言配置文件
    const settingsFile = path.join(langFolder,"settings.js")
    try{        
        // 读取多语言配置文件
        const module =await importModule(`file:///${settingsFile}`) 
        const langSettings = module.default;
        let { languages,defaultLanguage,activeLanguage,namespaces }  = langSettings
        
        logger.log(t("支持的语言\t: {}"),languages.map(item=>`${item.title}(${item.name})`).join(","))
        logger.log(t("默认语言\t: {}"),defaultLanguage)
        logger.log(t("激活语言\t: {}"),activeLanguage)
        logger.log(t("名称空间\t: {}"),Object.keys(namespaces).join(","))
        logger.log(t("模块类型\t: {}"),moduleType)
        logger.log("")
        logger.log(t("编译结果输出至：{}"),langFolder)

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
                logger.log(t("读取语言文件{}失败:{}"),file,e.message)
            }
        })
        logger.log(t(" - 共合成{}条语言包文本"),Object.keys(messages).length)

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
            logger.log(t(" - 语言包文件: {}"),path.basename(langFile))
        })
        
        // 4. 生成id映射文件
        const idMapFile = path.join(langFolder,"idMap.js")
        if(moduleType==="esm"){
            fs.writeFileSync(idMapFile,`export default ${JSON.stringify(messageIds,null,4)}`)
        }else{
            fs.writeFileSync(idMapFile,`module.exports = ${JSON.stringify(messageIds,null,4)}`)
        }
        logger.log(t(" - idMap文件: {}"),path.basename(idMapFile))
        
        const templateContext = {
            scopeId:projectPackageJson.name,
            languages,
            defaultLanguage,
            activeLanguage,
            namespaces,
            moduleType,
            JSON
        }

        // 5 . 生成编译后的格式化函数文件
        const formattersFile =  path.join(langFolder,"formatters.js") 
        if(!fs.existsSync(formattersFile)){
            const formattersContent = artTemplate(path.join(__dirname,"templates","formatters.js"), templateContext )
            fs.writeFileSync(formattersFile,formattersContent)
            logger.log(t(" - 格式化器:{}"),path.basename(formattersFile))
        }else{ // 格式化器如果存在，则需要更改对应的模块类型
            let formattersContent = fs.readFileSync(formattersFile,"utf8").toString()
            if(moduleType == "esm"){
                 formattersContent = formattersContent.replaceAll(/\s*module.exports\s*\=/g,"export default ")
                 formattersContent = formattersContent.replaceAll(/\s*module.exports\./g,"export ")
            }else{
                formattersContent = formattersContent.replaceAll(/^\s*export\s*default\s*/g,"module.exports = ")
                formattersContent = formattersContent.replaceAll(/^\s*export\s*/g,"module.exports.")
            }
            fs.writeFileSync(formattersFile,formattersContent)
            logger.log(t(" - 更新格式化器:{}"),path.basename(formattersFile))
        }

        // 6. 生成编译后的访问入口文件
        const entryFile = path.join(langFolder,"index.js")
        const entryContent = artTemplate(path.join(__dirname,"templates","entry.js"), templateContext )
        fs.writeFileSync(entryFile,entryContent)
        logger.log(t(" - 访问入口文件: {}"),path.basename(entryFile))

        


        // 7. 重新生成settings ,需要确保settings.js匹配模块类型
        if(moduleType==="esm"){
            fs.writeFileSync(settingsFile,`export default ${JSON.stringify(langSettings,null,4)}`)
        }else{
            fs.writeFileSync(settingsFile,`module.exports = ${JSON.stringify(langSettings,null,4)}`)
        }

        // 8. 生成package.json
        const packageJsonFile = path.join(langFolder,"package.json")
        let packageJson = {}
        if(moduleType==="esm"){
            packageJson = {
                license:"MIT",
                type:"module",
            } 
        }else{
            packageJson = { 
                license:"MIT",
            }
        }
        fs.writeFileSync(packageJsonFile,JSON.stringify(packageJson,null,4))
    }catch(e){ 
        logger.log(t("加载多语言配置文件<{}>失败: {} "),settingsFile,e.message)
    }
}