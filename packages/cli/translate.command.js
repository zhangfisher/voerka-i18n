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

const createLogger = require("logsets") 
const path = require("path")
const { i18nScope,t } = require("./i18nProxy")
const fs = require("fs-extra")
const { glob } = require("glob")
const logger = createLogger() 
const { deepMerge,getProjectSourceFolder } = require("@voerkai18n/utils")
const { Command } = require('commander');

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
/**
 * 翻译多条文本
 * @param {*} to 
 * @param {*} messages 
 * @param {*} options 
 * @returns 
 */
async function translateMessages(messages={},from="zh",to="en",options={}){
    let { mode,qps=1 } = options
    if(messages.length===0) return;
    const provider = getTranslateProvider(options)
    await delay(1000/qps)
    let translatedMessages =await provider.translate(Object.keys(messages),from,to)
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
    let result =  await provider.translate(messages,from,to)
    return result.join("\n")
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
    let lngMessages = {} ,packageSize =0
    for(let [ text,lngs ] of Object.entries(messages)){
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
            lngMessages[text]={[to]:''}
            packageSize+=text.length
            // 多个信息合并进行翻译，减少请求次数
            if(packageSize>=options.maxPackageSize){
                await translateMessages(lngMessages,from,to,options)
                result = deepMerge(result,lngMessages)
                packageSize=0
                lngMessages={}
            }
        }            
    }
    // 对剩余的信息进行翻译
    if(Object.keys(lngMessages).length > 0){
        await translateMessages(lngMessages,from,to,options)
        result = deepMerge(result,lngMessages)
    }

   return result

}

/**
 * 翻译指定的文件
 * @param {*} file 
 * @param {*} langSettings 
 * @param {*} options 
 */
async function translateMessageFile(file,langSettings,options={}){    
    let context = this
    logger.log(t("正在翻译文件:{}"),path.basename(file))
    let messages = fs.readJSONSync(file);
    // texts = {text:{zh:"",en:"",...,jp:""}}
    let results = {}
    const tasks = logger.tasklist()    
    for(let lng  of langSettings.languages){
        if(lng.name === langSettings.defaultLanguage) continue
        try{
            tasks.add(t(" - 翻译 -> {}",lng.name))
            results = deepMerge(results,await translateLanguage(messages,langSettings.defaultLanguage,lng.name,options))
            tasks.complete()
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
    let {   backup, appkey,appid,provider="baidu",qps=1 } = options;
    if(!provider && !(appkey && appid) ) throw new Error(t("需要指定翻译脚本或者appkey和appid"))

    const langFolder = path.join(srcFolder,"languages");
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
        const lang= process.env.LANGUAGE || "zh"
        await i18nScope.change(lang)     
    })
    .action((location,options) => { 
        location = getProjectSourceFolder(location)
        translate(location,options)
    });

program.parseAsync(process.argv);
 