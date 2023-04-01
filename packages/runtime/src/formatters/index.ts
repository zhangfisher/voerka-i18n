/**
 *    内置的格式化器 
 *    被注册到全局语言管理器
 */

import enFormatters  from "./en" 
import zhFormatters  from "./zh" 
import defaultFormatters from "./default"

export default {
    "*":{
        ...enFormatters,
        ...defaultFormatters
    },
    zh:zhFormatters
}
