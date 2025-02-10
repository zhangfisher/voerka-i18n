const { aiQuestion } = require('@voerkai18n/utils');
const { t } = require("../../i18n");
const fastGlob = require("fast-glob"); 
const logsets = require("logsets");
const path = require("node:path");
const fs = require("node:fs");
const { readFile, writeFile, rm:deleteFile } = require('flex-tools/fs/nodefs');


function hasImportTranslteFunc(code) {
    return /import\s+\{.*\bt\b.*\}\s+from\s+(['"])[^'"]+\1/gm.test(code) || /const\s+\{.*\bt\b.*\}\s*=\s*require\(['"][^'"]+['"]\)/gm.test(code);
}

/**
 * 将代码中的字符串字面量用i18n翻译函数包裹 
 * @param {import('@voerkai18n/utils').VoerkaI18nProjectContext} ctx
 */
async function wrap(ctx){  

    const { patterns } = ctx 
    const { key:apiKey,model ,url:apiUrl } = ctx.api

    const tasks = logsets.tasklist({ width:80,grouped:true })

    const promptTemplate = await ctx.getPrompt(ctx.prompt)
    if(!promptTemplate){
        logsets.log(t("未找到提示模板{}"),ctx.prompt)
        return
    }

    tasks.addGroup(t("开始自动应用翻译{}函数"),'t')
    tasks.addMemo(t("应用范围: {}"),patterns.join(", "))         
 
    const files = await fastGlob(patterns,{
        absolute: true
    })
 
    tasks.addGroup(t("共处理{}个文件"),files.length)

    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            const wrappedFile = file.replace(path.extname(file),".wrapped"+path.extname(file)) 
            tasks.add(t("处理{}"),relFile)        
            if(fs.existsSync(wrappedFile)){
                tasks.skip()
            }else{
                const code = await readFile(file,{ encoding: "utf-8" })    

                ctx.file = path.normalize(file)
                ctx.code = code
                ctx.importPath = path.relative(path.dirname(file),path.join(ctx.langDir,"index")).replaceAll("\\","/").slice(0,-6)
                if(!ctx.importPath.startsWith(".")) ctx.importPath="./"+ctx.importPath                
                const prompt = promptTemplate.params(ctx)
                const result = await aiQuestion(prompt,{
                    apiUrl,
                    apiKey,
                    model
                })              

                if(result.trim()==='' || !hasImportTranslteFunc(result)){
                    tasks.skip()
                }else{
                    await writeFile(wrappedFile,result,{ encoding: "utf-8" })            
                    tasks.complete()
                }
            }
        }catch(e){
            tasks.error(e)
        }
    }       
    tasks.addGroup(t("注意："));
    tasks.addMemo(t("保存结果到同名的{}文件,不会修改原文件"),".wrapped.*");
    tasks.addMemo(t("接下来可以使用{}命令更新到原文件"),"voerkai18n wrap --apply");
    tasks.done()
}


async function applyWrap(ctx){
    const patterns = ctx.patterns.filter( pattern => {
        return pattern.startsWith("!") && pattern!=="!**/*.wrapped.*"
    });
    patterns.push("**/*.wrapped.*")
 
    const files = await fastGlob(patterns,{
        absolute: true
    })
    if(files.length===0){
        logsets.log(t("未找到任何{}文件"),".wrapped.*")
        return
    }else{
        const tasks = logsets.tasklist()
        tasks.addGroup(t("开始应用{}修改,共应用{}个文件"),'Wrap',files.length)
        for(let wrappedFile of files){
            try{
                const relFile= path.relative(process.cwd(),wrappedFile)        
                tasks.add(t("应用{}"),relFile)        
                const code = await readFile(wrappedFile,{ encoding: "utf-8" })    
                const outfile = wrappedFile.replace(".wrapped","") 
                try{
                    await writeFile(outfile,code,{ encoding: "utf-8" })
                    await deleteFile(wrappedFile)
                    tasks.complete()
                }catch(e){
                    throw e
                }                
            }catch(e){
                tasks.error(e)
            }
        }
        tasks.done()
    }
}

module.exports = {
    wrap,
    applyWrap
}