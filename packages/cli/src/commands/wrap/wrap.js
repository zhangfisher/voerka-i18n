const { aiQuestion } = require('@voerkai18n/utils');
const { t } = require("../../i18n");
const fastGlob = require("fast-glob"); 
const logsets = require("logsets");
const path = require("path");
const { readFile, writeFile } = require('flex-tools/fs/nodefs');

/**
 * 将代码中的字符串字面量用i18n翻译函数包裹 
 * @param {import('@voerkai18n/utils').VoerkaI18nProjectContext} ctx
 */
async function wrap(ctx,tasks) { 
    const { patterns } = ctx 



    const promptTemplate = await ctx.getPrompt(ctx.prompt)
    if(!promptTemplate){
        logsets.log(t("未找到提示模板{}"),ctx.prompt)
        return
    }

    tasks.addGroup(t("开始自动应用翻译{}函数"),'t')
    tasks.addMemo(t(" - 应用范围: {}"),patterns.join(", "))         
 
    const files = await fastGlob(patterns,{
        absolute: true
    })
 
    tasks.addMemo(t("共处理{}个文件"),files.length)

    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            tasks.add(t("处理{}"),relFile)        
            const code = await readFile(file,{ encoding: "utf-8" })    
            ctx.file = file
            ctx.code = code
            const prompt = promptTemplate.params(ctx)
            const result =await aiQuestion(prompt,ctx.api)
            const outfile = file.replace(path.extname(file),".wrapped"+path.extname(file)) 
            if(ctx.apply){
                await writeFile(outfile,result,{ encoding: "utf-8" })
            }
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }   
    
    tasks.addGroup(t("注意："));
    tasks.addMemo(t("命令结果保存到同名的.wrapped文件,不会修改原文件"));
    tasks.addMemo(t("接下来可以使用{}命令更新到原文件"),"voerkai18n wrap --apply");
}


async function applyWrap(ctx,tasks){
    const { patterns } = ctx 
 

    tasks.addGroup(t("开始应用"),'t')
 
    const files = await fastGlob(patterns,{
        absolute: true
    })
 
    tasks.addMemo(t("共处理{}个文件"),files.length)
}

module.exports = {
    wrap,
    applyWrap
}