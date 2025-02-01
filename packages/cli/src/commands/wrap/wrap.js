const { aiQuestion } = require('@voerkai18n/utils');
const { t } = require("../../i18n");
const fastGlob = require("fast-glob"); 
const logsets = require("logsets");
const path = require("path");
const fs = require("node:fs");
const { readFile, writeFile } = require('flex-tools/fs/nodefs');
const { createPrompt } = require('./prompts');

/**
 * 将代码中的字符串字面量用i18n翻译函数包裹 
 */
async function wrap(settings) { 
    const { langDir, langRelDir,patterns } = settings 
    logsets.header(t("开始自动应用翻译{}函数"),'t')
    logsets.log(t(" - 应用范围: {}"),patterns.join(", "))         

    const tasks = logsets.tasklist({ width:80 })

    const files = await fastGlob(patterns,{
        absolute: true
    })
    logsets.header(t("共处理{}个文件"),files.length)
    logsets.separator(88)
    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            tasks.add("处理{}",relFile)        
            const code = await readFile(file,{ encoding: "utf-8" })
            settings.file = file
            const prompt = createPrompt(code,settings)
            const result =await aiQuestion(prompt,settings.api)
            await writeFile(file.replace(path.extname(file),".wrapped"+path.extname(file)),result,{ encoding: "utf-8" })
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }   
}



module.exports = {
    wrap
}