const { aiQuestion } = require('@voerkai18n/utils');
const { t } = require("../../i18n");
 
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
 * 移除字符串前后的字符
 * 
 * trimAll(" hello world  ") => "hello world"
 * trimAll(" \nhello world\n ") => "hello world"
 * 
 * @param {*} str 
 * @param {*} chars 
 * @returns 
 */
function trimAll(str,chars=["\n","\r"," ",'"',"'"]){
    let start = 0
    let end = str.length
    while(start<end && chars.includes(str[start])){
        start++
    }
    while(end>start && chars.includes(str[end-1])){
        end--
    }
    return str.substring(start,end) 
}

 
 
module.exports = function(params){
    const { key:apiKey,model ,url:apiUrl } = params
    return {
        translate:async (texts=[],from,to,ctx)=>{     
            const promptTemplate =await ctx.getPrompt(ctx.prompt) 
            if(!promptTemplate){
                throw new Error(t("未找到提示模板{}"),ctx.prompt)
            }
            const prompt = replaceVars(promptTemplate,{
                content: texts.join("\n"),
                from,
                to
            })
            const result = await aiQuestion(prompt,{
                apiUrl,
                model,
                apiKey
            }) 
            return trimAll(result).split("\n")  
        }
    }
}
  
