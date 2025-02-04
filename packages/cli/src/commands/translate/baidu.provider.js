const md5 = require("md5");
const qs = require("qs");
const baiduTagMap = require('bcp47-language-tags/mapper/baidu').default;
 

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
            return new Promise((resolve,reject)=>{             
                fetch(`${baseurl}?${params}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error_code) {
                            reject(new Error(`${data.error_msg}(code=${data.error_code})`));
                        } else {
                            const result = data.trans_result.map(item =>fixMesssage(item.dst))
                            resolve(restoreInterpVars(result,interpVars));
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

    }
}