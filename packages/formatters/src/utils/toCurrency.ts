import { isNumber } from "flex-tools/typecheck/isNumber" 


/**
 * 为字符串按bits位添加一个,
 * @param {*} str 
 * @param {*} bits 
 * @returns 
 */
function addSplitChars(str:string,bits:number=3){
   let regexp =  new RegExp(String.raw`(?!^)(?=(\d{${bits}})+$)`,"g")
   let r = str.replace(regexp,",")
   if(r.startsWith(",")) r = r.substring(1)
   if(r.endsWith(",")) r = r.substring(0,r.length-2)
   return r
}


/**
 * 转换为货币格式
 * 
 * @param {*} value      可以是数字也可以是字符串
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} prefix      前缀
 * @param {*} suffix      后缀
 * @param {*} precision   小数点精确到几位，-1-保留原始位数
 * @param {*} format      格式模块板字符串
 * @returns 
 */
export function toCurrency(value:string|number ,params:Record<string,any>){
    let { symbol="",division=3,prefix="",precision=-1,suffix="",unit=0,radix=3,units=[],format="{symbol}{value}{unit}" }  = params

    // 1. 分离出整数和小数部分
    let [ wholeDigits,decimalDigits ] = String(value).split(".")
    // 2. 转换数制单位   比如将元转换到万元单位
    // 如果指定了unit单位，0-代表默认，1-N代表将小数点字向后移动radix*unit位
    // 比如 123456789.88   
    // 当unit=1,radix=3时，   == [123456,78988]  // [整数,小数]
    // 当unit=2,radix=3时，   == [123,45678988]  // [整数,小数]
    if(unit>0 && radix>0){
        // 不足位数时补零
        if(wholeDigits.length<radix*unit) wholeDigits = Array.from({length:radix*unit-wholeDigits.length+1}).fill(0).join("")+ wholeDigits    
        // 将整数的最后radix*unit字符移到小数部分前面
        decimalDigits=wholeDigits.substring(Number(wholeDigits),wholeDigits.length-radix*unit)+decimalDigits        
        wholeDigits  = wholeDigits.substring(0,wholeDigits.length-radix*unit)
        if(wholeDigits=="") wholeDigits = "0"      
    } 
    // 3. 添加分割符号
    let result = []
    result.push(addSplitChars(wholeDigits,division))

    // 4. 处理保留小数位数，即精度
    if(decimalDigits && isNumber(precision) && precision!=0){        
        if(precision==0){                
        }else if(precision==-1){
            result.push(`.${decimalDigits}`)
        }else if(precision>0){
            // let finalBits = decimalDigits.length  // 四舍五入前的位数
            if(precision<0){//-1代表保留原始位数
                decimalDigits = String(parseFloat(`0.${decimalDigits}`))
            }else{  // 否则按指定位数进行四舍五入处理
                decimalDigits = String(parseFloat(`0.${decimalDigits}`).toFixed(precision)).split(".")[1]
                //如果经过四舍五入处理后的位数小于，代表精度进行舍去，则未尾显示+符号
                //if(finalBits > decimalDigits.length) decimalDigits+="+"
            }                        
            result.push(`.${decimalDigits}`)
        }                   
    } 
    // 5. 模板替换 
    const unitName = units[unit] || ""
    return format.replace("{value}",result.join(""))
                    .replace("{symbol}",symbol)
                    .replace("{prefix}",prefix)
                    .replace("{suffix}",suffix)
                    .replace("{unit}",unitName)
}
