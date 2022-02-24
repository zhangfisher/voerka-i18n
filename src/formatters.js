/**
 *    默认的格式化器
 * 
 *    使用方法:
 *   
 *   在translates/xxx.json文件中进行翻译时，可以对插值变量进行格式化，
 * 
 *   {
 *      "Now is {date}":{
 *         "zh-CN":"现在是{date|time}"
 *      }
 *   }
 *   
 * 
 */
export default {        
    cn:{
        Date:{
            default:(value)=>dayjs(value).format("YYYY年MM年DD日"),  // 默认的变量格式化器
            time:(value)=>dayjs(value).format("HH:mm:ss"),
            short:(value)=>dayjs(value).format("YYYY/MM/DD"),
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