/**
 *    默认的格式化器
 * 
 *    使用方法:
 *   
 *   {
 *      "My birthday is {date}":{
 *         "zh-CN":"我的生日是{date|time}"
 *      }
 *   }
 * 
 *  t("My birthday is {date}",new Date(1975,11,25))
 *   
 * 
 */
const dayjs = require("dayjs");

module.exports = {        
    cn:{
        "*":{           // 适用于所有类型的格式化器
            default:null                            // 默认格式化器
        },
        Date:{
            default:(value)=>dayjs(value).format("YYYY年MM年DD日"),  // 默认的格式化器
            time:(value)=>dayjs(value).format("HH:mm:ss"),
            date:(value)=>dayjs(value).format("YYYY/MM/DD")
        },
        Number:{
            
        }       
    },
    en:{
        "Date":{
            short:(value)=>dayjs(value).format("YYYY/MM/DD"),
            time:(value)=>dayjs(value).format("HH:mm:ss") 
        }                
    }
}