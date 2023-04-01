/***
 * 
 * 处理数字相关
 * 
 * { value | number }
 * { value | number('default') }
 * { value | number('regular') }
 * { value | number('big') }
 * 
 */
const { isNumber,toNumber } = require("../utils")
const { Formatter } = require("../formatter")
const { toCurrency } = require("./currency")

const numberFormartter = Formatter(function(value,precision,division,$config){
    return toCurrency(value, { division, precision},$config)
},{
    normalize: toNumber,
    params:["precision","division"],
    configKey: "number"
})

 