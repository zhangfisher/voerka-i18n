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


const defaultPrompt = `
你是一名专业的翻译人员，请将以下内容从{from}翻译成{to}语言,并直接返回翻译结果，不需要任何解释。

{content}

翻译要求：
- 请尽量保持原文的意思，不要随意改动原文
- 保留内容中的所有标点符号以及特殊字符,每行内容之间请用换行符分隔
- 内容中使用了{}包裹的内容为插值变量，不需要翻译，请保留原样并符合上下文语义要求。
`
 
module.exports = function(params){
    const { key:apiKey,model ,url:apiUrl } = params
    return {
        translate:async (texts=[],from="zh",to="en",ctx)=>{     
            const promptTemplate =await ctx.getPrompt(ctx.prompt,defaultPrompt) 
            if(!promptTemplate){
                throw new Error(t("未找到提示模板{}"),ctx.prompt)
            }
            const prompt = replaceVars(promptTemplate,{
                content: JSON.stringify(texts.join("\n")),
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
  