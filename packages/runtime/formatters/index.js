/**
 *    内置的格式化器 
 *    被注册到全局语言管理器
 */

const enFormatters     = require("./en") 
const zhFormatters     = require("./zh") 
const defaultFormatters = require("./default")
 
module.exports = {
    "*":{
        ...enFormatters,
        ...defaultFormatters
    },
    zh:zhFormatters
}