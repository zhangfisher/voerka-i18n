/**
 *    内置的格式化器 
 */

const enFormatters     = require("./en") 
const zhFormatters     = require("./zh") 
const commonFormatters = require("./common")
 
module.exports = {
    "*":{
        ...enFormatters,
        ...commonFormatters
    },
    zh:zhFormatters
}