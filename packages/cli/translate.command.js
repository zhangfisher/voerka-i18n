#!/usr/bin/env node

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
 *          - zh.json
 *          - ...
 *       idMap.js                    // id映射列表
 *       settings.json                 // 配置文件
 *       zh.js                       // 中文语言包
 *       en.js                       // 英文语言包
 *       [lang].js                   // 其他语言包
 * 
 * @param {*} opts 
 */

const logsets = require("logsets") 
const path = require("path")
const { i18nScope,t } = require("./i18nProxy")
const fs = require("fs-extra")
const { glob } = require("glob") 
const { deepMerge,getProjectSourceFolder,getSettingsFromPackageJson } = require("@voerkai18n/utils")
const { Command } = require('commander');
const { getCliLanguage } = require("./oslocate")
const { getActiveLanguage,getDefaultLanguage  } = require("./utils")

const delay = async (t) => new Promise(resolve=>setTimeout(resolve,t))

function normalizeTranslateOptions(opts={}) {
     let options = Object.assign({
         appkey:null,                               
         appid:null,
         backup:true,                         // 是否备份原始文件
         mode:"auto",                         // 是否全部翻译，auto=仅仅对未翻译的内容进行翻译，full=全部翻译
         provider:null,                       // 指定脚本文件来进行翻译
     }, opts)

     return options;
}

function getTranslateProvider(options={}){
    const  { provider } = options;
    if(provider==="baidu"){
        return require("./baidu.translate.js")(options)
    }else{
        return require(provider)(options)
    }
}
function hasInterpolation(str) {
	return str.includes("{") && str.includes("}");
}

/**
 * 文本中的插值变量不进行翻译，所以需要进行替换为特殊字符，翻译后再替换回来
 * 
 * 如“My name is {},I am {} years old” 先替换为“My name is {VARIABLE},I am {VARIABLE} years old” 
 * 翻译后再替换回来
 *  
 * @param {String | Object} messages 
 */
function replaceInterpVars(messages){
    const interpVars = []
    const msgs = Array.isArray(messages) ? messages : Object.keys(messages)
    const replacedMessages = msgs.map((message)=>{
        let vars=[]
        let result = message.replaceAll(/\{\s*.*?\s*\}/gm,(matched)=>{
            vars.push(matched)
            return `{VARIABLE}`
        })
        interpVars.push(vars)
        return result
    })
    return [replacedMessages,interpVars]
}
/**
 * 将翻译后的内容还原为插值变量
 * @param {String[]} messages   翻译后的内容
 * @param {*} interpVars 
 */
function restoreInterpVars(messages,interpVars){ 
    return messages.map((message,index)=>{
        let i = 0
        return message.replaceAll(/\{VARIABLE\}/gm,()=>interpVars[index][i++])
    })
}

/**
 * 翻译多条单行文本
 * @param {*} to 
 * @param {*} messages  保存要翻译的内容
 * @param {*} options 
 * @returns 
 */
async function translateMessages(messages={},from="zh",to="en",options={}){
    let { qps=1 } = options
    if(messages.length===0) return;
    const provider = getTranslateProvider(options)
    await delay(1000/qps)
    // 将文本中的插值变量替换为特殊字符，避免翻译时对插值变量进行翻译
    const [replacedMessages,interpVars] = replaceInterpVars(messages)
    let translatedMessages
    try{
        translatedMessages =await provider.translate(replacedMessages,from,to)
    }catch(e){
        throw new Error(t('调用翻译API时出错:{}',e.message))
    }
    
    
    translatedMessages = restoreInterpVars(translatedMessages,interpVars)

    Object.keys(messages).forEach((key,index)=>{
        messages[key][to] = translatedMessages[index]
    })
    return messages
}
/**
 * 翻译多行文本
 * @param {*} messages 
 * @param {*} options 
 * @returns 
 */
async function translateMultiLineMessage(messages=[],from,to,options={}){
    if(messages.length===0) return;
    const qps = options.qps || 1
    const provider = getTranslateProvider(options)    
    await delay(1000/qps)
    const [replacedMessages,interpVars] = replaceInterpVars(messages)

    let translatedMessages =  await provider.translate(replacedMessages,from,to)
    
    translatedMessages = restoreInterpVars(translatedMessages,interpVars)

    return translatedMessages.join("\n")
}

/**
 * 翻译指定的语言
 * @param {*} messages 
 * @param {*} from 
 * @param {*} to 
 * @param {*} options 
 * @returns 
 */
async function translateLanguage(messages,from,to,options={}){
    const { maxPackageSize,mode  } = options;
    let result = {}
    let translatedMessages = {} ,packageSize =0
    for(let [ text,lngs ] of Object.entries(messages)){
        // 由于复数需要手动配置，不进行翻译
        if(Array.isArray(lngs[to])) continue;
        // 如果mode=auto，则当翻译内容已经有变化时，则不再翻译
        if(mode=="auto" && typeof(lngs[to])==="string" && (lngs[to]!=text && lngs[to].trim()!="")){
            if(!(text in result)) result[text] = {}
            result[text][to] =lngs[to]
            continue;
        }
        // 由于百度翻译按\n来分行翻译，如果有\n则会出现多行翻译的情况，因此，如果有\n则就不将多条文件合并翻译
        if(text.includes("\n")){
            if(!(text in result)) result[text] = {}
            result[text][to] = await translateMultiLineMessage(text.split("\n"),from,to,options)
        }else{            
            translatedMessages[text]={[to]:''}
            packageSize+=text.length
            // 多个信息合并进行翻译，减少请求次数
            if(packageSize>=maxPackageSize){
                await translateMessages(translatedMessages,from,to,options)
                result = deepMerge(result,translatedMessages)
                packageSize=0
                translatedMessages={}
            }
        }            
    }
    // 对剩余的信息进行翻译
    if(Object.keys(translatedMessages).length > 0){
        await translateMessages(translatedMessages,from,to,options)
        return  deepMerge(result,translatedMessages)
    }else{
        return  {}
    }
}

/**
 * 翻译指定的文件
 * @param {*} file 
 * @param {*} langSettings 
 * @param {*} options 
 */
async function translateMessageFile(file,langSettings,options={}){    
    let context = this
    logsets.log(t("正在翻译文件:{}"),path.basename(file))
    let messages = fs.readJSONSync(file);
    // texts = {text:{zh:"",en:"",...,jp:""}}
    let results = {}
    const tasks = logsets.tasklist()    
    const defaultLanguage= getDefaultLanguage(langSettings.languages)

    for(let lng  of langSettings.languages){
        if(lng.name === defaultLanguage) continue
        try{
            tasks.add(t("翻译 {} -> {}"),[defaultLanguage,lng.name])
            const msgs = await translateLanguage(messages,defaultLanguage,lng.name,options)
            if(Object.keys(msgs).length>0){
                results = deepMerge(results,msgs)
                tasks.complete()
            }else{
                tasks.skip()
            }
        }catch(e){
            tasks.error(e.message || e)
        }
    }
    results = deepMerge(messages,results) 
    // 写入原始文件
    fs.writeFileSync(file,JSON.stringify(results,null,4))
}
 


async function translate(srcFolder,opts={}){
    const options = normalizeTranslateOptions(opts);
    let {   backup, appkey,appid,provider="baidu",entry="languages" } = options;
    if(!provider && !(appkey && appid) ) throw new Error(t("需要指定翻译脚本或者appkey和appid"))

    const langFolder = path.join(srcFolder,entry);
    const files = glob.sync(path.join(langFolder,"translates/*.json"))
    const langSettings = fs.readJSONSync(path.join(langFolder,"settings.json"))   
    // 保存一些调用信息，用来在翻译完成后，显示
    let context = {
        provider,
        files:[]    // 翻译的文件{filename:<翻译>,messages:<数量>,calls:<调用>,timeConsuming:<耗时>}
    }

    // 枚举所有需要翻译的文件
    for(let file of files){
        // 备份原始文件
        const backupFile = path.join(langFolder,"translates","backup",path.basename(file))
        if(backup && !fs.existsSync(backupFile)){
            if(!fs.existsSync(path.dirname(backupFile))) fs.mkdirSync(path.dirname(backupFile))
            fs.copyFileSync(file,backupFile)
        }
        // 翻译文件
        await translateMessageFile.call(context,file,langSettings,options)
    }
}

const program = new Command();

program
    .argument('[location]', t('工程项目所在目录'))
    .description(t('调用在线翻译服务商的API翻译译指定项目的语言包,如使用百度云翻译服务'))
    .option('--no-backup', t('备份原始文件'))
    .option('--mode', t('翻译模式，取值auto=仅翻译未翻译的,full=全部翻译'), 'auto')
    .option('-p, --provider <value>', t('在线翻译服务提供者名称或翻译脚本文件'), 'baidu')
    .option('-m, --max-package-size <value>', t('将多个文本合并提交的最大包字节数'), 200)
    .option('--appid [id]', t('API ID'))
    .option('--appkey [key]', t('API密钥'))
    .option('-q, --qps <value>', t('翻译速度限制,即每秒可调用的API次数'), 1)  
    .hook("preAction",async function(location){
        await i18nScope.change(getCliLanguage())     
    })
    .action((location,options) => { 
        location = getProjectSourceFolder(location)
        // 从本地package.json读取合并配置
        options = Object.assign({},getSettingsFromPackageJson(location),options)   
        translate(location,options)
    });

program.parseAsync(process.argv);
 