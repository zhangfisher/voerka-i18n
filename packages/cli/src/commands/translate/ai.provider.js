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

const defaultPrompt = `
你是一名专业的翻译人员，请将以下内容从{from}翻译成{to}语言,并直接返回翻译结果，不需要任何解释。
{content}

翻译要求：
- 请尽量保持原文的意思，不要随意改动原文
- 保留内容中的所有标点符号以及特殊字符
- 内容中使用了{}包裹的内容为插值变量，不需要翻译，请保留原样并符合上下文语义要求。
`
 
/**
 * q	string	是	请求翻译query	UTF-8编码
 * from	string	是	翻译源语言	可设置为auto
 * to	string	是	翻译目标语言	不可设置为auto
 * appid	string	是	APPID	可在管理控制台查看
 * salt	string	是	随机数	可为字母或数字的字符串
 * sign	string	是	签名	appid+q+salt+密钥的MD5值
*
*  @param {} ctx  {id,key,url}
*/
module.exports = function(params){
    const { key:apiKey,model ,url:apiUrl } = params
    return {
        translate:async (texts=[],from="zh",to="en",ctx)=>{     

            const promptTemplate = defaultPrompt//  await ctx.getPrompt(ctx.prompt)
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
            return result.split("\n") 

        }
    }
}
  