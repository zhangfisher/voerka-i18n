const axios = require("axios")
const md5 = require("md5");
const qs = require("qs");


/**
 * q	string	是	请求翻译query	UTF-8编码
from	string	是	翻译源语言	可设置为auto
to	string	是	翻译目标语言	不可设置为auto
appid	string	是	APPID	可在管理控制台查看
salt	string	是	随机数	可为字母或数字的字符串
sign	string	是	签名	appid+q+salt+密钥的MD5值
*
 * 
 */
module.exports = function(options={}){
    const { appkey,appid ,baseurl = "http://api.fanyi.baidu.com/api/trans/vip/translate" } = options;
    return {
        /**
         * 
         * @param {*} texts 多条文本
         * @returns 
         */
        translate:async (texts=[],from="zh",to="en")=>{           

            if(Array.isArray(texts)){
                texts = texts.join("\n");
            }
            // 在翻译内容中如果包含|,()等在插值变量里面需要的符号时，百度翻译会将其转成全角符号，这会导致插值变量无法识别，所以需要转回来
            let isIncludeSensitiveChar = texts.includes("|") || texts.includes(",") || texts.includes("(") || texts.includes(")")
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
                axios.get(`${baseurl}?${params}`).then(res=>{
                    const { data } = res;
                    if(data.error_code){
                        reject(new Error(data.error_msg))
                    }else{
                        resolve(res.data.trans_result.map(item=>{
                            // 在翻译时会将一些|,等符号转成全角符号，这会导致插值变量无法识别，所以需要转回来                            
                            if(isIncludeSensitiveChar){
                                return item.dst.replaceAll("｜","|").replaceAll("，",",").replaceAll("（","(").replaceAll("）",")")
                            }else{
                                return item.dst
                            }                            
                        }));
                    }                    
                }).catch(err=>{
                    reject(err);
                })
            });
        }

    }
}