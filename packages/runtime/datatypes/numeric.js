/***
 * 
 * 处理数字相关
 * 
 */
 const { Formatter } = require("../formatter")
/**
 * 转换为数字类型
 */
 function toNumber(value,defualt=0) {
    try {
        if (isNumber(value)) {
            return parseFloat(value)
        } else {
            return defualt
        }
    } catch {
        return value 
    }
} 

const numberFormartter = Formatter(function(value,precision,division,$config){
    return toCurrency(value, { division, precision})
},{
    normalize: toNumber,
    params:["precision","division"],
    configKey: "number"
})

module.exports = {
    toNumber,
    numberFormartter
}