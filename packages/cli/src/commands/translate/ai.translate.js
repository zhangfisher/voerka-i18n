const { aiQuestion } = require('@voerkai18n/utils');
const { t } = require("../../i18n");
const fastGlob = require("fast-glob"); 
const logsets = require("logsets");
const path = require("node:path");
const fs = require("node:fs");
const { readFile, writeFile } = require('flex-tools/fs/nodefs');
 
function replaceVars(str,vars){
    return str.replace(/\{\s*(\w+)\s*\}/gm,(match,name)=>{
        if(name in vars){
            return vars[name]
        }else{
            return match
        }
    })
}

/**
 * 将一个json文件拆分为多个json文件,返回一个数组
 * @param {Object} content 
 */
function splitJson(content){
    if(typeof content !== "object") content = JSON.parse(content)
    const results = []
    const maxItems = 20
    let item = {}
    let i=0
    for(let [key,value] of Object.entries(content)){
        i++
        item[key] = value
        if(i>=maxItems){
            results.push(item)
            item = {}
            i=0
        }
    }
    return results
}


function getBakFile(file){
    let i = 0
    while(true){
        const bakFile =  file.replace(".json",`.${++i}.json`)
        if(!fs.existsSync(bakFile)){
            return bakFile
        }
    }
}




async function translate(ctx) { 
    const { langDir } = ctx 

    const tasks = logsets.tasklist({ width:80,grouped:true})

    const promptTemplate = await ctx.getPrompt(ctx.prompt)
    if(!promptTemplate){
        logsets.log(t("未找到提示模板{}"),ctx.prompt)
        return
    }
    const translateDir = path.join(langDir,"translates")

    const files = await fastGlob("*.json",{
        cwd: translateDir,
        absolute: true
    })

    logsets.header(t("准备翻译{}个文件"),files.length)
    
    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            const task = tasks.add("翻译{}",relFile)        
            const content = await readFile(file,{ encoding: "utf-8" })    
            ctx.file = file
            // 拆分json文件
            const chunks = splitJson(content)
            const results = []
            // 逐个翻译
            for(let i=0;i<chunks.length;i++){
                const chunk = chunks[i]
                task.note(`${i+1}/${chunks.length}`)
                ctx.content = chunk
                const prompt = replaceVars(promptTemplate,{
                    content: JSON.stringify(chunk),
                    defaultLanguage: ctx.defaultLanguage,
                })
                const result = await aiQuestion(prompt,ctx.api)    
                results.push(result)
            }
            // 合并结果
            const translated = results.reduce((prev,current)=>{
                return {...prev,...JSON.parse(current)}
            },{})
            const text = JSON.stringify(translated,null,4)
            // 备份原始文件
            const bakFile = getBakFile(file)
            await writeFile(bakFile,content,{ encoding: "utf-8" })

            // 写入翻译后的文件
            await writeFile(file,text,{ encoding: "utf-8" })
            tasks.complete()
        }catch(e){
            tasks.error(e)
            logsets.log(e.stack)
        }
    }   
}



module.exports = {
    translate
}