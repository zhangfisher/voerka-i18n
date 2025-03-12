const md5 = require("md5");
const qs = require("qs");
const baiduTagMap = require('bcp47-language-tags/mapper/baidu').default;
const axios = require('axios');
 

// const ERRORS = {
//     52000: "成功",
//     52001: "请求超时 - 检查请求query是否超长，以及原文或译文参数是否在支持的语种列表里",
//     52002: "系统错误 - 请重试",
//     52003: "未授权用户 - 请检查appid是否正确或者服务是否开通",
//     54000: "必填参数为空 - 请检查是否少传参数",
//     54001: "签名错误 - 请检查您的签名生成方法",
//     54003: "访问频率受限 - 请降低您的调用频率，或在控制台进行身份认证后切换为高级版/尊享版",
//     54004: "账户余额不足 - 请前往管理控制台为账户充值",
//     54005: "长query请求频繁 - 请降低长query的发送频率，3s后再试",
//     58000: "客户端IP非法 - 检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改",
//     58001: "译文语言方向不支持 - 检查译文语言是否在语言列表里",
//     58002: "服务当前已关闭 - 请前往管理控制台开启服务",
//     58003: "此IP已被封禁 - 同一IP当日使用多个APPID发送翻译请求，则该IP将被封禁当日请求权限，次日解封。请勿将APPID和密钥填写到第三方软件中。",
//     90107: "认证未通过或未生效 - 请前往我的认证查看认证进度",
//     20003: "请求内容存在安全风险 - 请检查请求内容"
// }

/**
 * 文本中的插值变量不进行翻译，所以需要进行替换为特殊字符，翻译后再替换回来
 * 
 * 如“My name is {},I am {} years old” 先替换为“My name is __$_$_$__,I am __$_$_$__ years old” 
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
            return `__$_$_$__`
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
        return message.replaceAll(/__\s*\$_\s*\$_\s*\$__/gm,()=>interpVars[index][i++])
    })
}
/**
 * 在翻译内容中如果包含|,()等在插值变量里面需要的符号时，百度翻译会将其转成全角符号，这会导致插值变量无法识别，所以需要转回来
 * @param {*} message 
 * @returns 
 */
function fixMesssage(message){
    return message.replaceAll("｜", "|")
                    .replaceAll("，", ",")
                    .replaceAll("（", "(")
                    .replaceAll("）", ")");
} 
/**
 * q	  string	是	请求翻译query	UTF-8编码
 * from	  string	是	翻译源语言	可设置为auto
 * to	  string	是	翻译目标语言	不可设置为auto
 * appid  string	是	APPID	可在管理控制台查看
 * salt	  string	是	随机数	可为字母或数字的字符串
 * sign	  string	是	签名	appid+q+salt+密钥的MD5值
*
*  @param {} ctx  {id,key,url}
*/
module.exports = function(params){
    const { key:appkey,id:appid ,url:baseurl = "http://api.fanyi.baidu.com/api/trans/vip/translate" } = params
    return {
        translate:async (texts=[],from="zh",to="en")=>{           
            from = baiduTagMap[from] || from;
            to = baiduTagMap[to] || to; 
                
            const [fixedTexts,interpVars] = replaceInterpVars(texts)
            texts = fixedTexts.join("\n") 
 
            // saltStep1. 拼接字符串1：
            // 拼接[appid=2015063000000001][q=apple][salt=1435660288][密钥=12345678]得到字符串1：“2015063000000001apple143566028812345678”
            // Step2. 计算签名：（对字符串1做MD5加密）
            // sign=MD5(2015063000000001apple143566028812345678)，得到sign=f89f9594663708c1605f3d736d01d2d4
            const salt = new Date().getTime()
            const sign = md5(`${appid}${texts}${salt}${appkey}`);
            let params = qs.stringify({
                q:texts,
                from,
                to,
                appid,
                salt,
                sign
            });   
            try {
                const response = await axios.get(`${baseurl}?${params}`);
                const data = response.data;
                if (data.error_code) {
                    throw new Error(`${data.error_msg}(code=${data.error_code})`);
                } else {
                    const result = data.trans_result.map(item => fixMesssage(item.dst));
                    return restoreInterpVars(result, interpVars);
                }
            } catch (err) {
                throw err;
            }
        }

    }
}