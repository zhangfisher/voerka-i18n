'use strict';

/**
 * 判断是否是JSON对象
 * @param {*} obj 
 * @returns 
 */
 function isPlainObject$6(obj){
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    var baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto; 
}

/**
 * 判断值是否是一个数字
 * @param {*} value 
 * @returns 
 */
 function isNumber$4(value){
    if(value==undefined) return false
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false        
    try{
        if(value.includes(".")){
            let v = parseFloat(value);
            if(value.endsWith(".")){                
                return !isNaN(v) && String(v).length===value.length-1
            }else {
                return !isNaN(v) && String(v).length===value.length
            }            
        }else {
            let v = parseInt(value);
            return !isNaN(v) && String(v).length===value.length
        }    
    }catch{
        return false
    }
}
function isFunction$6(fn){
    return typeof fn === "function"
}
/**
 * 当value= null || undefined || "" || [] || {} 时返回true
 * @param {*} value 
 * @returns 
 */
function isNothing$1(value){
    if(["boolean","function"].includes(typeof(value))) return false
    if(value=="") return true    
    if(value==undefined) return true    
    if(Array.isArray(value) && value.length==0) return true
    if(typeof(value)=="object" && Object.keys(value).length==0) return true
    return false
} 

/**
 * 深度合并对象
 * 
 * 注意：
 *  - 不会对数组成员进行再次遍历
 *  - 不能处理循环引入
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @param {*} options 
 *     array : 数组合并策略，0-替换，1-合并，2-去重合并
 *     mixin : 是否采用混入方式来，=false,  则会创建新对象并返回
 */
function deepMerge$1(toObj,formObj,options={}){
    let results = options.mixin ? toObj : Object.assign({},toObj);
    Object.entries(formObj).forEach(([key,value])=>{
        if(key in results){
            if(typeof value === "object" && value !== null){
                if(Array.isArray(value)){
                    if(options.array === 1){//合并
                        results[key] = [...results[key],...value];
                    }else if(options.array === 2){//去重合并
                        results[key] = [...new Set([...results[key],...value])];
                    }else {                  //默认： 替换
                        results[key] = value;
                    }
                }else {
                    results[key] = deepMerge$1(results[key],value,options);
                }
            }else {
                results[key] = value;
            }
        }else {
            results[key] = value;
        }
    });
    return results
}
 
function deepMixin$2(toObj,formObj,options={}){
    return deepMerge$1(toObj,formObj,{...options,mixin:true})
}

/**
 * 获取指定变量类型名称
 * getDataTypeName(1) == Number
 * getDataTypeName("") == String
 * getDataTypeName(null) == Null
 * getDataTypeName(undefined) == Undefined
 * getDataTypeName(new Date()) == Date
 * getDataTypeName(new Error()) == Error
 * 
 * @param {*} v 
 * @returns 
 */
 function getDataTypeName$2(v){
	if (v === null)  return 'Null' 
	if (v === undefined) return 'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
}/**
 * 格式化日期
 * 将值转换为Date类型
 * @param {*} value  
 */
function toDate$1(value) {
    try {
        return value instanceof Date ? value : new Date(value)
    } catch {
        return value
    }
}
/**
 * 转换为数字类型
 */
function toNumber$2(value,defualt=0) {
    try {
        if (isNumber$4(value)) {
            return parseFloat(value)
        } else {
            return defualt
        }
    } catch {
        return value 
    }
} 
/**
 * 转换为货币格式
 * 
 * @param {*} value      可以是数字也可以是字符串
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} prefix      前缀
 * @param {*} suffix      后缀
 * @param {*} precision   小数点精确到几位，0-自动
 * @param {*} format      格式模块板字符串
 * @returns 
 */
 function toCurrency$1(value,params={}){
    let {symbol="",division=3,prefix="",precision=2,suffix="",unit=0,unitName="",radix=3,format="{symbol}{value}{unit}"}  = params;

    // 1. 分离出整数和小数部分
    let [wholeDigits,decimalDigits] = String(value).split(".");
    // 2. 转换数制单位   比如将元转换到万元单位
    // 如果指定了unit单位，0-代表默认，1-N代表将小数点字向后移动radix*unit位
    // 比如 123456789.88   
    // 当unit=1,radix=3时，   == [123456,78988]  // [整数,小数]
    // 当unit=2,radix=3时，   == [123,45678988]  // [整数,小数]
    if(unit>0 && radix>0){
        // 不足位数时补零
        if(wholeDigits.length<radix*unit) wholeDigits = new Array(radix*unit-wholeDigits.length+1).fill(0).join("")+ wholeDigits;    
        // 将整数的最后radix*unit字符移到小数部分前面
        decimalDigits=wholeDigits.substring(wholeDigits,wholeDigits.length-radix*unit)+decimalDigits;        
        wholeDigits  = wholeDigits.substring(0,wholeDigits.length-radix*unit);
        if(wholeDigits=="") wholeDigits = "0";      
    }

    // 3. 添加分割符号
    let result = [];
    for(let i=0;i<wholeDigits.length;i++){
        if(((wholeDigits.length - i) % division)==0 && i>0) result.push(",");
        result.push(wholeDigits[i]);
    }
    // 4. 处理保留小数位数，即精度
    if(decimalDigits){
        // 如果precision是一个数字，则进行四舍五入处理
        if(isNumber$4(precision) && precision>0){// 四舍五入处理
            let finalBits = decimalDigits.length;  // 四舍五入前的位数
            decimalDigits = String(parseFloat(`0.${decimalDigits}`).toFixed(precision)).split(".")[1];
            //如果经过四舍五入处理后的位数小于，代表精度进行舍去，则未尾显示+符号
            if(finalBits > decimalDigits.length) decimalDigits+="+";
        }
        result.push(`.${decimalDigits}`);
    }
    result = result.join("");
    // 5. 模板替换
    result = format.replace("{value}",result)
                    .replace("{symbol}",symbol)
                    .replace("{prefix}",prefix)
                    .replace("{suffix}",suffix)
                    .replace("{unit}",unitName);
    return result
}

/**
 * 根据路径获取指定值
 * 只支持简单的.分割路径
 * getByPath({a:{b:1}},"a.b") == 1
 * getByPath({a:{b:1}},"a.c",2) == 2
 * 
 * @param {*} obj 
 * @param {*} path          使用.分割的路径
 * @param {*} defaultValue  默认值
 * @returns 
 */
function getByPath$2(obj,path,defaultValue){
    if(typeof(obj)!="object" || typeof(path)!="string") return defaultValue
    let paths = path.split(".");
    let cur = obj;
    for(let key of paths){
        if(typeof(cur)=="object" && (key in cur) ){
            cur = cur[key];
        }else {
            return defaultValue
        }
    }
    return cur
}
function deepClone$1(obj){
    if(obj==undefined) return obj
    if (['string',"number","boolean","function","undefined"].includes(typeof(obj))){
        return obj
    }else if(Array.isArray(obj)){
        return obj.map(item => deepClone$1(item))        
    }else if(typeof(obj)=="object"){
        let results = {};
        Object.entries(obj).forEach(([key,value])=>{
            results[key] = deepClone$1(value);         
        });
        return results
    }else {
        return obj
    }    
}


// YY	18	年，两位数
// YYYY	2018	年，四位数
// M	1-12	月，从1开始
// MM	01-12	月，两位数字
// MMM	Jan-Dec	月，英文缩写
// D	1-31	日
// DD	01-31	日，两位数
// H	0-23	24小时
// HH	00-23	24小时，两位数
// h	1-12	12小时
// hh	01-12	12小时，两位数
// m	0-59	分钟
// mm	00-59	分钟，两位数
// s	0-59	秒
// ss	00-59	秒，两位数
// S	0-9	毫秒（百），一位数
// SS	00-99	毫秒（十），两位数
// SSS	000-999	毫秒，三位数
// Z	-05:00	UTC偏移
// ZZ	-0500	UTC偏移，两位数
// A	AM / PM	上/下午，大写
// a	am / pm	上/下午，小写
// Do	1st... 31st	月份的日期与序号

function formatDatetime$1(value,templ="YYYY/MM/DD HH:mm:ss"){
    const v = toDate$1(value);
    const year =String(v.getFullYear()),month = String(v.getMonth()+1);String(v.getDay());const day=String(v.getDate());
    const hourNum = v.getHours();
    const hour = String(hourNum), minute = String(v.getMinutes()),second = String(v.getSeconds()),millisecond=String(v.getMilliseconds());
    const vars = [
        ["YYYY", year],                                                 // 2018	年，四位数
        ["YY", year.substring(year.length - 2, year.length)],           // 18	年，两位数        
        ["MMM", ""],                                                    // Jan-Dec	月，英文缩写
        ["MM", month.padStart(2, "0")],                                 // 01-12	月，两位数字
        ["M", month],                                                   // 1-12	月，从1开始
        ["DD", day.padStart(2, "0")],                                   // 01-31	日，两位数
        ["D", day],                                                     // 1-31	日
        ["HH", hour.padStart(2, "0")],                          // 00-23	24小时，两位数
        ["H", hour],                                            // 0-23	24小时
        ["hh", String(hourNum > 12 ? hourNum - 12 : hourNum).padStart(2, "0")],  // 01-12	12小时，两位数
        ["h", String(hourNum > 12 ? hourNum - 12 : hourNum)],                            // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"],                                 // am / pm	上/下午，小写
    ];
    let result = templ;
    vars.forEach(([k,v])=>result = replaceAll$1(result,k,v));
    return result
}

function formatTime$1(value,templ="HH:mm:ss"){
    const v = toDate$1(value);
    const hourNum = v.getHours();
    const hour = String(hourNum),minute = String(v.getMinutes()),second = String(v.getSeconds()),millisecond=String(v.getMilliseconds());
    let result = templ;
    const vars = [
        ["HH", hour.padStart(2, "0")],                          // 00-23	24小时，两位数
        ["H", hour],                                            // 0-23	24小时
        ["hh", String(hour > 12 ? hour - 12 : hour).padStart(2, "0")],  // 01-12	12小时，两位数
        ["h", String(hour > 12 ? hour - 12 : hour)],                            // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"]                                  // am / pm	上/下午，小写
    ];
    vars.forEach(([k,v])=>result = replaceAll$1(result,k,v));
    return result
}
/**
 * 替换所有字符串
 * 低版本ES未提供replaceAll,此函数用来替代
 * 
 * 
 * @param {*} str 
 * @param {*} findValue 
 * @param {*} replaceValue 
 */
function replaceAll$1(str,findValue,replaceValue){    
    if(typeof(str)!=="string" || findValue=="" || findValue==replaceValue) return str
    let result = str;
    try{
        while(result.includes(findValue)){
            result = result.replace(findValue,replaceValue);
        }        
    }catch{}
    return result
}
/**
 *   使用正则表达式解析非标JOSN
 * 
 */

 const bastardJsonKeyRegex = /(?<value>(?<=:\s*)(\'.*?\')+)|(?<key>(([\w\u4e00-\u9fa5])|(\'.*?\'))+(?=\s*\:))/g;

 /**
  * 当需要采用正则表达式进行字符串替换时，需要对字符串进行转义
  * 
  * 比如  str = "I am {username}"  
  * replace(new RegExp(str),"Tom") !===  I am Tom
  * 
  * 因为{}是正则表达式元字符，需要转义成 "\{username\}"
  * 
  * replace(new RegExp(escapeRegexpStr(str)),"Tom")
  * 
  * 
  * @param {*} str 
  * @returns 
  */
 function escapeRegexpStr$1(str){
     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
 } 
/**
 * 解析非标的JSON字符串为{}
 * 非标的JSON字符串指的是：
 *  - key没有使用使用""包裹
 *  - 字符串value没有使用""包裹
 *  
 * @param {*} str 
 * @returns 
 */
function safeParseJson$1(str){
    let matched; 
    while ((matched = bastardJsonKeyRegex.exec(str)) !== null) {
        if (matched.index === bastardJsonKeyRegex.lastIndex) {
            bastardJsonKeyRegex.lastIndex++;
        }                
        let item = matched[0];
        if(item.startsWith("'") && item.endsWith("'")){
            item = item.substring(1,item.length-1);
        }
        const findValue =  matched.groups.key ? new RegExp( escapeRegexpStr$1(matched[0]) + "\s*:") : new RegExp(":\s*" +  escapeRegexpStr$1(matched[0]));
        const replaceTo = matched.groups.key ? `"${item}":` : `: "${item}"`;
        str = str.replace(findValue,replaceTo);
    }
    return JSON.parse(str)
}

var utils ={
    isPlainObject: isPlainObject$6,
    isFunction: isFunction$6,
    isNumber: isNumber$4,
    isNothing: isNothing$1,
    deepClone: deepClone$1,
    deepMerge: deepMerge$1,
    deepMixin: deepMixin$2,
    replaceAll: replaceAll$1,
    getByPath: getByPath$2,
    getDataTypeName: getDataTypeName$2,
    formatDatetime: formatDatetime$1,
    formatTime: formatTime$1,
    toDate: toDate$1,
    toNumber: toNumber$2,
    toCurrency: toCurrency$1,
    escapeRegexpStr: escapeRegexpStr$1,
    safeParseJson: safeParseJson$1
};

/**
 * 
 * 解析格式化器
 * 
 * 解析{ varname | formater(...params) }中的params部分
 * 
 * 
 * 
 */

const { getByPath: getByPath$1,isNumber: isNumber$3,isFunction: isFunction$5,isPlainObject: isPlainObject$5,escapeRegexpStr,safeParseJson } = utils;


/**
使用正则表达式对原始文本内容进行解析匹配后得到的便以处理的数组

formatters="| aaa(1,1) | bbb "

统一解析为

[
    [aaa,[1,1]],         // [<格式化器名称>,[args,...]]
    [<格式化器名称>,[<参数>,<参数>,...]]
]

formatters="| aaa(1,1,"dddd") | bbb "

特别注意：
- 目前对参数采用简单的split(",")来解析，因此如果参数中包括了逗号等会影响解析的字符时，可能导致错误
例如aaa(1,1,"dd,,dd")形式的参数
在此场景下基本够用了，如果需要支持更复杂的参数解析，可以后续考虑使用正则表达式来解析
- 如果参数是{},[]，则尝试解决为对象和数组，但是里面的内容无法支持复杂和嵌套数据类型

@param {String} formatters  

@returns  [ [<格式化器名称>,[<参数>,<参数>,...],[<格式化器名称>,[<参数>,<参数>,...]],...]
*/
function parseFormatters$1(formatters) {
    if (!formatters) return [];
    // 1. 先解析为 ["aaa()","bbb"]形式
    let result = formatters.trim().substring(1).trim().split("|").map((r) => r.trim());
    // 2. 解析格式化器参数
    return result.map((formatter) => {
            if (formatter == "") return null;
            let firstIndex = formatter.indexOf("(");
            let lastIndex = formatter.lastIndexOf(")");
            if (firstIndex !== -1 && lastIndex !== -1) { //参数的格式化器   
                // 带参数的格式化器: 取括号中的参数字符串部分
                const strParams = formatter.substring(firstIndex + 1, lastIndex).trim();
                // 解析出格式化的参数数组
                let params = parseFormaterParams(strParams);
                // 返回[<格式化器名称>,[<参数>,<参数>,...]
                return [formatter.substring(0, firstIndex), params];
            } else { // 不带参数的格式化器               
                return [formatter, []];
            }
        }).filter((formatter) => Array.isArray(formatter));
}


 /**
  * 生成可以解析指定标签的正则表达式
  * 
  * getNestingParamsRegex()     -- 能解析{}和[]
  * getNestingParamsRegex(["<b>","</b>"]),
  * 
  * @param  {...any} tags 
  * @returns 
  */
function getNestingParamsRegex(...tags){
    if(tags.length==0){
        tags.push(["{","}"]);
        tags.push(["[","]"]);
    }
    const tagsRegexs = tags.map(([beginTag,endTag])=>{
        return `(${escapeRegexpStr(beginTag)}1%.*?%1${escapeRegexpStr(endTag)})`
    });
    return formatterNestingParamsRegex.replace("__TAG_REGEXP__",tagsRegexs.length > 0 ? tagsRegexs.join("|")+"|" : "")
}
 
 /**
  * 
  *  遍历字符串中的 beginTag和endTag,添加辅助序号
  * 
  * @param {*} str 
  * @param {*} beginTag 
  * @param {*} endTag 
  * @returns 
  */
 function addTagFlags(str,beginTag="{",endTag="}"){
     let i = 0;
     let flagIndex = 0; 
     while(i<str.length){
         let beginChars = str.slice(i,i+beginTag.length);
         let endChars = str.slice(i,i+endTag.length);        
         if(beginChars==beginTag){
             flagIndex++;
             str = str.substring(0,i+beginTag.length) + `${flagIndex}%` + str.substring(i+beginTag.length);             
             i+=beginTag.length + String(flagIndex).length+1;
             continue
         }
         if(endChars==endTag){
             if(flagIndex>0){
                 str = str.substring(0,i) + `%${flagIndex}` + str.substring(i); 
             }            
             i+= endTag.length + String(flagIndex).length +1; 
             flagIndex--;
             continue
         }
         i++;        
     }
     return str
 }
 
 /**
  * 增加标签组辅助标识
  * 
  *  addTagHelperFlags("sss",["<div>","</div>"]
  * 
  * @param {*} str 
  * @param  {...any} tags  默认已包括{},[]
  */
 function addTagHelperFlags(str,...tags){
     if(tags.length==0){
         tags.push(["{","}"]);
         tags.push(["[","]"]);
     }
     tags.forEach(tag=>{
         if(str.includes(tag[0]) && str.includes(tag[1])){
             str = addTagFlags(str,...tag);
         }
     });
     return str
 }
 
 function removeTagFlags(str,beginTag,endTag){
     const regexs = [
         [beginTag,new RegExp(escapeRegexpStr(beginTag)+"\\d+%")],
         [endTag,new RegExp("%\\d+"+escapeRegexpStr(endTag))]
     ];
    regexs.forEach(([tag,regex])=>{
        let matched;
        while ((matched = regex.exec(str)) !== null) {
            if (matched.index === regex.lastIndex) regex.lastIndex++;            
            str = str.replace(regex,tag);
        }
    });
     return str    
 }
 
 function removeTagHelperFlags(str,...tags){
     if(tags.length==0){
         tags.push(["{","}"]);
         tags.push(["[","]"]);
     }
     tags.forEach(([beginTag,endTag])=>{
         if(str.includes(beginTag) && str.includes(endTag)){
             str = removeTagFlags(str,beginTag,endTag);
         }        
     });
     return str
 }

// 提取匹配("a",1,2,'b',{..},[...]),不足：当{}嵌套时无法有效匹配
//  const formatterParamsRegex = /((([\'\"])(.*?)\3)|(\{.*?\})|(\[.*?\])|([\d]+\.?[\d]?)|((true|false|null)(?=[,\b\s]))|([\w\.]+)|((?<=,)\s*(?=,)))(?<=\s*[,\)]?\s*)/g;
 
// 支持解析嵌套的{}和[]参数， 前提是：字符串需要经addTagHelperFlags操作后，会在{}[]等位置添加辅助字符
const formatterNestingParamsRegex = String.raw`((([\'\"])(.*?)\3))|__TAG_REGEXP__([\d]+\.?[\d]?)|((true|false|null)(?=[,\b\s]))|([\w\.]+)|((?<=,)\s*(?=,))(?<=\s*[,\)]?\s*)`;
  
/**
 *  解析格式化器的参数,即解析使用,分割的函数参数
 * 
 *  采用正则表达式解析
 *  支持number,boolean,null,String,{},[]的参数，可以识别嵌套的{}和[]
 *  
 * @param {*} strParams    格式化器参数字符串，即formater(<...参数....>)括号里面的参数，使用,分割 
 * @returns {Array}  返回参数值数组 []
 */
 function parseFormaterParams(strParams) {
    let params = [];
    let matched;
    // 1. 预处理： 处理{}和[]嵌套问题,增加嵌套标识
    strParams = addTagHelperFlags(strParams); 
    try{
        let regex =new RegExp(getNestingParamsRegex(),"g");
        while ((matched = regex.exec(strParams)) !== null) {
            // 这对于避免零宽度匹配的无限循环是必要的
            if (matched.index === regex.lastIndex) {
                regex.lastIndex++;
            }        
            let value = matched[0];
            if(value.trim()==''){
                value = null;
            }else if((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))){
                value = value.substring(1,value.length-1);
                value = removeTagHelperFlags(value);
            }else if((value.startsWith("{") && value.endsWith("}")) || (value.startsWith('[') && value.endsWith(']'))){
                try{
                    value = removeTagHelperFlags(value);
                    value = safeParseJson(value);
                }catch{}
            }else if(["true","false","null"].includes(value)){
                value = JSON.parse(value);
            }else if(isNumber$3(value)){
                value = parseFloat(value);
            }else { 
                value = removeTagHelperFlags(String(value));
            }
            params.push(value); 
        }
    }catch{
        
    }
    return params
} 
/**
 * 创建格式化器
 * 
 * 格式化器是一个普通的函数，具有以下特点：
 * 
 * - 函数第一个参数是上一上格式化器的输出
 * - 支持0-N个简单类型的入参
 * - 可以是定参，也可以变参
 * - 格式化器可以在格式化器的$config参数指定一个键值来配置不同语言时的参数
 *  
 *   "currency":createFormatter((value,prefix,suffix, division ,precision,$config)=>{
 *     // 无论在格式化入参数是多少个，经过处理后在此得到prefix,suffix, division ,precision参数已经是经过处理后的参数
 *     依次读取格式化器的参数合并：
 *       - 创建格式化时的defaultParams参数
 *       - 从当前激活格式化器的$config中读取配置参数
 *       - 在t函数后传入参数
  *     比如currency格式化器支持4参数，其入参顺序是prefix,suffix, division ,precision
  *     那么在t函数中可以使用以下五种入参数方式
  *      {value | currency }                                    //prefix=undefined,suffix=undefined, division=undefined ,precision=undefined
  *      {value | currency(prefix) }
  *      {value | currency(prefix,suffix) }
  *      {value | currency(prefix,suffix,division)  }
  *      {value | currency(prefix,suffix,division,precision)}
  *    
  * 经过createFormatter处理后，会从当前激活格式化器的$config中读取prefix,suffix, division ,precision参数作为默认参数
  * 然后t函数中的参数会覆盖默认参数，优先级更高
 *      },
 *      {
 *          unit:"$",
 *          prefix,
 *          suffix,
 *          division,
 *          precision
 *      },
 *      {
 *          normalize:value=>{...},
 *          params:["prefix","suffix", "division" ,"precision"]     // 声明参数顺序
 *          configKey:"currency"                                    // 声明特定语言下的配置在$config.currency
 *      }
 *   )
 * 
 * @param {*} fn 
 * @param {*} options               配置参数
 * @param {*} defaultParams         可选默认值
 * @returns 
 */
 function createFormatter$1(fn,options={},defaultParams={}){
    let opts = Object.assign({
        normalize    : null,         // 对输入值进行规范化处理，如进行时间格式化时，为了提高更好的兼容性，支持数字时间戳/字符串/Date等，需要对输入值进行处理，如强制类型转换等
        params       : null,         // 可选的，声明参数顺序，如果是变参的，则需要传入null
        configKey    : null          // 声明该格式化器在$config中的路径，支持简单的使用.的路径语法
    },options);     

    // 最后一个参数是传入activeFormatterConfig参数
    const $formatter =  function(value,...args){
        let finalValue = value;
        // 1. 输入值规范处理，主要是进行类型转换，确保输入的数据类型及相关格式的正确性，提高数据容错性
        if(isFunction$5(opts.normalize)){
            try{
                finalValue = opts.normalize(finalValue);
            }catch{}
        }
        // 2. 读取activeFormatterConfig
        let activeFormatterConfigs = args.length>0 ? args[args.length-1] : {};
        if(!isPlainObject$5( activeFormatterConfigs))  activeFormatterConfigs ={};   
        // 3. 从当前语言的激活语言中读取配置参数
        const formatterConfig =Object.assign({},defaultParams,getByPath$1(activeFormatterConfigs,opts.configKey,{}));
        let finalArgs;
        if(opts.params==null){// 如果格式化器支持变参，则需要指定params=null
            finalArgs = args.slice(0,args.length-1);
        }else {  // 具有固定的参数个数
            finalArgs = opts.params.map(param=>getByPath$1(formatterConfig,param,undefined));   
            // 4. 将翻译函数执行格式化器时传入的参数覆盖默认参数     
            for(let i =0; i<finalArgs.length;i++){
                if(i==args.length-1) break // 最后一参数是配置
                if(args[i]!==undefined) finalArgs[i] = args[i];
            }
        }
        
        return fn(finalValue,...finalArgs,formatterConfig)
    };
    $formatter.configurable = true;       //  当函数是可配置时才在最后一个参数中传入$config
    return $formatter
}

const Formatter$2 = createFormatter$1;

var formatter$1 = {
    createFormatter: createFormatter$1,
    Formatter: Formatter$2,
    parseFormatters: parseFormatters$1
};

/**
 *
 * 处理翻译文本中的插件变量
 *
 * 处理逻辑如下：
 *
 *   以"Now is { value | date | prefix('a') | suffix('b')}"为例：
 *
 *  1. 先判断一下输入是否包括{的}字符，如果是则说明可能存在插值变量，如果没有则说明一定不存在插值变量。
 *    这样做的目的是如果确认不存在插值变量时，就不需要后续的正则表表达式匹配提取过程。
 *    这对大部份没有采用插件变量的文本能提高性能。
 *  2. forEachInterpolatedVars采用varWithPipeRegexp正则表达式，先将文本提取出<变量名称>和<格式化器部分>，
 *    即:
 *      变量名称="value"
 *      formatters = "date | prefix('a') | suffix('b')"
 *   3. 将"formatters"使用|转换为数组 ["date","prefix('a')","suffix('b')"]
 *   4. parseFormatters依次对每一个格式化器进行遍历解析为：
 *        [
 *          ["date",[]],
 *          ["prefix",['a']],
 *          ["suffix",['b']]
 *       ]
 *   5. 然后wrapperFormatters从scope中读取对应的格式化器定义,将之转化为
 *      [(value,config)=>{....},(value,config)=>{....},(value,config)=>{....}]
 *      为优化性能，在从格式化器名称转换为函数过程中会进行缓存
 *   6. 最后只需要依次执行这些格式化化器函数即可
 *
 *
 */

const { getDataTypeName: getDataTypeName$1,isPlainObject: isPlainObject$4,isFunction: isFunction$4,replaceAll } = utils;
const { parseFormatters } = formatter$1;

// 用来提取字符里面的插值变量参数 , 支持管道符 { var | formatter | formatter }
// 支持参数： { var | formatter(x,x,..) | formatter }
let varWithPipeRegexp =	/\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w*(\(.*\)){0,1}\s*)*)\s*\}/g;

/**
 * 考虑到通过正则表达式进行插值的替换可能较慢
 * 因此提供一个简单方法来过滤掉那些不需要进行插值处理的字符串
 * 原理很简单，就是判断一下是否同时具有{和}字符，如果有则认为可能有插值变量，如果没有则一定没有插件变量，则就不需要进行正则匹配
 * 从而可以减少不要的正则匹配
 * 注意：该方法只能快速判断一个字符串不包括插值变量
 * @param {*} str
 * @returns {boolean}  true=可能包含插值变量
 */
function hasInterpolation(str) {
	return str.includes("{") && str.includes("}");
}

/**
 *  解析格式化器的参数
 *
/**  
  * 提取字符串中的插值变量
  *  [
     //   {  
         name:<变量名称>,formatters:[{name:<格式化器名称>,args:[<参数>,<参数>,....]]｝],<匹配字符串>],
     //   ....
     // 
  * @param {*} str 
  * @param {*} isFull   =true 保留所有插值变量 =false 进行去重
  * @returns {Array} 
  * [
  *  {
  *      name:"<变量名称>",
  *      formatters:[
  *          {name:"<格式化器名称>",args:[<参数>,<参数>,....]},
  *          {name:"<格式化器名称>",args:[<参数>,<参数>,....]},
  *      ],
  *      match:"<匹配字符串>"
  *  },
  *  ...
  * ]
  */
function getInterpolatedVars$1(str) {
	let vars = [];
	forEachInterpolatedVars(str, (varName, formatters, match) => {
		let varItem = {
			name: varName,
			formatters: formatters.map(([formatter, args]) => {
				return {name: formatter,args: args	};
			}),
			match: match,
		};
		if (vars.findIndex((varDef) =>varDef.name === varItem.name &&	varItem.formatters.toString() ==varDef.formatters.toString()) === -1){
			vars.push(varItem);
		}
		return "";
	});
	return vars;
}
/**
 * 遍历str中的所有插值变量传递给callback，将callback返回的结果替换到str中对应的位置
 * @param {*} str
 * @param {Function(<变量名称>,[formatters],match[0])} callback
 * @param {Boolean} replaceAll   是否替换所有插值变量，当使用命名插值时应置为true，当使用位置插值时应置为false
 * @returns  返回替换后的字符串
 */
function forEachInterpolatedVars(str, replacer, options = {}) {
	let result = str, matched;
	let opts = Object.assign({replaceAll: true },options);
	varWithPipeRegexp.lastIndex = 0;
	while ((matched = varWithPipeRegexp.exec(result)) !== null) {
		const varname = matched.groups.varname || "";
		// 解析格式化器和参数 = [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
		const formatters = parseFormatters(matched.groups.formatters);
		if (isFunction$4(replacer)) {
			try {
				const finalValue = replacer(varname, formatters, matched[0]);
				if (opts.replaceAll) {
					result = replaceAll(result,matched[0], finalValue);
				} else {
					result = result.replace(matched[0], finalValue);
				}
			} catch {				
				break;// callback函数可能会抛出异常，如果抛出异常，则中断匹配过程
			}
		}
		varWithPipeRegexp.lastIndex = 0;
	}
	return result;
}

/**
 * 清空指定语言的缓存
 * @param {*} scope
 * @param {*} activeLanguage
 */
function resetScopeCache(scope, activeLanguage = null) {
	scope.$cache = { activeLanguage, typedFormatters: {}, formatters: {} };
}

/**
  *   取得指定数据类型的默认格式化器 
  *   
  *   可以为每一个数据类型指定一个默认的格式化器,当传入插值变量时，
  *   会自动调用该格式化器来对值进行格式化转换 
     const formatters =  {   
         "*":{
             $types:{...}                                    // 在所有语言下只作用于特定数据类型的格式化器
         },                                                  // 在所有语言下生效的格式化器    
         zh:{            
             $types:{         
                 [数据类型]:(value)=>{...}                  // 默认    
             }, 
             [格式化器名称]:(value)=>{...},
             [格式化器名称]:(value)=>{...},
             [格式化器名称]:(value)=>{...},
         },
         en:{.....}
     }
  * @param {*} scope 
  * @param {*} activeLanguage 
  * @param {*} dataType    数字类型
  * @returns {Function} 格式化函数  
  */
function getDataTypeDefaultFormatter(scope, activeLanguage, dataType) {
	// 当指定数据类型的的默认格式化器的缓存处理
	if (!scope.$cache) resetScopeCache(scope);
	if (scope.$cache.activeLanguage === activeLanguage) {
		if (dataType in scope.$cache.typedFormatters)
			return scope.$cache.typedFormatters[dataType];
	} else {
		// 当语言切换时清空缓存
		resetScopeCache(scope, activeLanguage);
	}
	const fallbackLanguage = scope.getLanguage(activeLanguage).fallback;
	// 先在当前作用域中查找，再在全局查找
	const targets = [
		scope.activeFormatters,
		scope.formatters[fallbackLanguage], // 如果指定了回退语言时,也在该回退语言中查找
		scope.global.formatters[activeLanguage],
		scope.global.formatters["*"],
	];
	for (const target of targets) {
		if (!target) continue;
		if (
			isPlainObject$4(target.$types) &&
			isFunction$4(target.$types[dataType])
		) {
			return (scope.$cache.typedFormatters[dataType] =
				target.$types[dataType]);
		}
	}
}

/**
 * 获取指定名称的格式化器函数
 *
 * 查找逻辑
 *  - 在当前作用域中查找
 *  - 在全局作用域中查找
 *
 * @param {*} scope
 * @param {*} activeLanguage        当前激活语言名称
 * @param {*} name                  格式化器名称
 * @returns  {Function}             格式化函数
 */
function getFormatter(scope, activeLanguage, name) {
	// 1. 从缓存中直接读取： 缓存格式化器引用，避免重复检索
	if (!scope.$cache) resetScopeCache(scope);
	if (scope.$cache.activeLanguage === activeLanguage) {
		if (name in scope.$cache.formatters)
			return scope.$cache.formatters[name];
	} else {
		// 当语言切换时清空缓存
		resetScopeCache(scope, activeLanguage);
	}
	const fallbackLanguage = scope.getLanguage(activeLanguage).fallback;
	// 2. 先在当前作用域中查找，再在全局查找 formatters={$types,$config,[格式化器名称]:()=>{},[格式化器名称]:()=>{}}
	const range = [
		scope.activeFormatters,
		scope.formatters[fallbackLanguage], // 如果指定了回退语言时,也在该回退语言中查找
		scope.global.formatters[activeLanguage], // 适用于activeLanguage全局格式化器
		scope.global.formatters["*"], // 适用于所有语言的格式化器
	];
	for (const formatters of range) {
		if (!formatters) continue;
		if (isFunction$4(formatters[name])) {
			return (scope.$cache.formatters[name] = formatters[name]);
		}
	}
}
/**
 * Checker是一种特殊的格式化器，会在特定的时间执行
 *
 * Checker应该返回{value,next}用来决定如何执行下一个格式化器函数
 *
 *
 * @param {*} checker
 * @param {*} value
 * @returns
 */
function executeChecker(checker, value) {
	let result = { value, next: "skip" };
	if (!isFunction$4(checker)) return result;
	try {
		const r = checker(value);
		if (isPlainObject$4(r)) {
			Object.assign(result, r);
		} else {
			result.value = r;
		}
		if (!["break", "skip"].includes(result.next)) result.next = "break";
	} catch (e) {}
	return result;
}
/**
 * 执行格式化器并返回结果
 *
 * 格式化器this指向当前scope，并且最后一个参数是当前scope格式化器的$config
 *
 * 这样格式化器可以读取$config
 *
 * @param {*} value
 * @param {Array[Function]} formatters  多个格式化器函数(经过包装过的)顺序执行，前一个输出作为下一个格式化器的输入
 */
function executeFormatter(value, formatters, scope, template) {
	if (formatters.length === 0) return value;
	let result = value;
	// 1. 空值检查
	const emptyCheckerIndex = formatters.findIndex(
		(func) => func.$name === "empty"
	);
	if (emptyCheckerIndex != -1) {
		const emptyChecker = formatters.splice(emptyCheckerIndex, 1)[0];
		const { value, next } = executeChecker(emptyChecker, result);
		if (next == "break") {
			return value;
		} else {
			result = value;
		}
	}
	// 2. 错误检查
	const errorCheckerIndex = formatters.findIndex(
		(func) => func.$name === "error"
	);
	let errorChecker;
	if (errorCheckerIndex != -1) {
		errorChecker = formatters.splice(errorCheckerIndex, 1)[0];
		if (result instanceof Error) {
			result.formatter = formatter.$name;
			const { value, next } = executeChecker(errorChecker, result);
			if (next == "break") {
				return value;
			} else {
				result = value;
			}
		}
	}

	// 3. 分别执行格式化器函数
	for (let formatter of formatters) {
		try {
			result = formatter(result, scope.activeFormatterConfig);
		} catch (e) {
			e.formatter = formatter.$name;
			if (scope.debug)
				console.error(
					`Error while execute i18n formatter<${formatter.$name}> for ${template}: ${e.message} `
				);
			if (isFunction$4(errorChecker)) {
				const { value, next } = executeChecker(errorChecker, result);
				if (next == "break") {
					if (value !== undefined) result = value;
					break;
				} else if (next == "skip") {
					continue;
				}
			}
		}
	}
	return result;
}

/**
 * 添加默认的empty和error格式化器，用来提供默认的空值和错误处理逻辑
 *
 * empty和error格式化器有且只能有一个，其他无效
 *
 * @param {*} formatters
 */
function addDefaultFormatters(formatters) {
	// 默认的空值处理逻辑： 转换为"",然后继续执行接下来的逻辑
	if (formatters.findIndex(([name]) => name == "empty") === -1) {
		formatters.push(["empty", []]);
	}
	// 默认的错误处理逻辑:  开启DEBUG时会显示ERROR:message；关闭DEBUG时会保持最近值不变然后中止后续执行
	if (formatters.findIndex(([name]) => name == "error") === -1) {
		formatters.push(["error", []]);
	}
}

/**
 *
 *  经parseFormatters解析t('{}')中的插值表达式中的格式化器后会得到
 *  [[<格式化器名称>,[参数,参数,...]]，[<格式化器名称>,[参数,参数,...]]]数组
 *
 *  本函数将之传换为转化为调用函数链，形式如下：
 *  [(v)=>{...},(v)=>{...},(v)=>{...}]
 *
 *  并且会自动将当前激活语言的格式化器配置作为最后一个参数配置传入,这样格式化器函数就可以读取
 *
 * @param {*} scope
 * @param {*} activeLanguage
 * @param {*} formatters
 * @returns {Array}   [(v)=>{...},(v)=>{...},(v)=>{...}]
 *
 */
function wrapperFormatters(scope, activeLanguage, formatters) {
	let wrappedFormatters = [];
	addDefaultFormatters(formatters);
	for (let [name, args] of formatters) {
		let fn = getFormatter(scope, activeLanguage, name);
		let formatter;
		// 格式化器无效或者没有定义时，查看当前值是否具有同名的原型方法，如果有则执行调用
		// 比如padStart格式化器是String的原型方法，不需要配置就可以直接作为格式化器调用
		if (isFunction$4(fn)) {
			formatter = (value, config) =>
				fn.call(scope, value, ...args, config);
		} else {
			formatter = (value) => {
				if (isFunction$4(value[name])) {
					return value[name](...args);
				} else {
					return value;
				}
			};
		}
		formatter.$name = name;
		wrappedFormatters.push(formatter);
	}
	return wrappedFormatters;
}

/**
 *  将value经过格式化器处理后返回的结果
 * @param {*} scope
 * @param {*} activeLanguage
 * @param {*} formatters
 * @param {*} value
 * @returns
 */
function getFormattedValue(scope, activeLanguage, formatters, value, template) {
	// 1. 取得格式化器函数列表，然后经过包装以传入当前格式化器的配置参数
	const formatterFuncs = wrapperFormatters(scope, activeLanguage, formatters);
	// 3. 执行格式化器
	// EMPTY和ERROR是默认两个格式化器，如果只有两个则说明在t(...)中没有指定格式化器
	if (formatterFuncs.length == 2) {
		// 当没有格式化器时，查询是否指定了默认数据类型的格式化器，如果有则执行
		const defaultFormatter = getDataTypeDefaultFormatter(
			scope,
			activeLanguage,
			getDataTypeName$1(value)
		);
		if (defaultFormatter) {
			return executeFormatter(value, [defaultFormatter], scope, template);
		}
	} else {
		value = executeFormatter(value, formatterFuncs, scope, template);
	}
	return value;
}

/**
  * 字符串可以进行变量插值替换，
  *    replaceInterpolatedVars("<模板字符串>",{变量名称:变量值,变量名称:变量值,...})
  *    replaceInterpolatedVars("<模板字符串>",[变量值,变量值,...])
  *    replaceInterpolatedVars("<模板字符串>",变量值,变量值,...])
  * 
 - 当只有两个参数并且第2个参数是{}时，将第2个参数视为命名变量的字典
     replaceInterpolatedVars("this is {a}+{b},{a:1,b:2}) --> this is 1+2
 - 当只有两个参数并且第2个参数是[]时，将第2个参数视为位置参数
     replaceInterpolatedVars"this is {}+{}",[1,2]) --> this is 1+2
 - 普通位置参数替换
     replaceInterpolatedVars("this is {a}+{b}",1,2) --> this is 1+2
 - 
 this == scope == { formatters: {}, ... }
 * @param {*} template 
 * @returns 
 */
function replaceInterpolatedVars$2(template, ...args) {
	const scope = this;
	// 当前激活语言
	const activeLanguage = scope.global.activeLanguage;
	// 没有变量插值则的返回原字符串
	if (args.length === 0 || !hasInterpolation(template)) return template;

	// ****************************变量插值****************************
	if (args.length === 1 && isPlainObject$4(args[0])) {
		// 读取模板字符串中的插值变量列表
		// [[var1,[formatter,formatter,...],match],[var2,[formatter,formatter,...],match],...}
		let varValues = args[0];
		return forEachInterpolatedVars(template,(varname, formatters, match) => {
				let value = varname in varValues ? varValues[varname] : "";
				return getFormattedValue(scope,activeLanguage,formatters,value,template);
			}
		);
	} else {
		// ****************************位置插值****************************
		// 如果只有一个Array参数，则认为是位置变量列表，进行展开
		const params =args.length === 1 && Array.isArray(args[0]) ? [...args[0]] : args;
		if (params.length === 0) return template; // 没有变量则不需要进行插值处理，返回原字符串
		let i = 0;
		return forEachInterpolatedVars(template,(varname, formatters, match) => {
				if (params.length > i) {
					return getFormattedValue(scope,activeLanguage,formatters,params[i++],template);
				} else {
					throw new Error(); // 抛出异常，停止插值处理
				}
			},
			{ replaceAll: false }
		);
	} 
}

var interpolate = {
	forEachInterpolatedVars,				// 遍历插值变量并替换
	getInterpolatedVars: getInterpolatedVars$1, 					// 获取指定字符串中的插件值变量列表
	replaceInterpolatedVars: replaceInterpolatedVars$2					// 替换插值变量
};

/**
* 
* 简单的事件触发器
* 
*/

var eventemitter = class EventEmitter{
    constructor(){
        this._callbacks = [];
    }
    on(callback){
        if(this._callbacks.includes(callback)) return
        this._callbacks.push(callback);
    }
    off(callback){
        for(let i=0;i<this._callbacks.length;i++){
            if(this._callbacks[i]===callback ){
                this._callbacks.splice(i,1);
            }
        }
    }
    offAll(){
        this._callbacks = [];
    }
    async emit(...args){
        if(Promise.allSettled){
            await Promise.allSettled(this._callbacks.map(cb=>cb(...args)));
        }else {
            await Promise.all(this._callbacks.map(cb=>cb(...args)));
        }
    }    
};

/**
 *   日期时间格式化器
 * 
 */

const { toDate,toCurrency,toNumber: toNumber$1,isPlainObject: isPlainObject$3,formatDatetime,formatTime } = utils;
 const { Formatter: Formatter$1 } = formatter$1;

/**
 * 日期格式化器
 *  format取值：
 *  0-local,1-long,2-short,3-iso,4-gmt,5-UTC
 *  或者日期模板字符串
 *   默认值是local
 */
const dateFormatter = Formatter$1((value,format,$config)=>{
    const optionals = ["local","long","short","iso","gmt","utc"];
    // 处理参数：同时支持大小写名称和数字
    const optionIndex = optionals.findIndex((v,i)=>{
        if(typeof(format)=="string"){
            return v==format || v== format.toUpperCase()
        }else if(typeof(format)=="number"){
            return format === i
        }
    });
    switch(optionIndex){
        case 0: // local
            return value.toLocaleString()
        case 1: // long
            return formatDatetime(value,$config.long) 
        case 2: // short
            return formatDatetime(value,$config.short) 
        case 3: // ISO
            return value.toISOString()
        case 4: // GMT
            return value.toGMTString()
        case 5: // UTC
            return value.toUTCString()
        default:
            return formatDatetime(value,format) 
    }  
},{  
    normalize: toDate,                       // 转换输入为Date类型
    params   : ['format'],
    configKey: "datetime.date"
});
// 季度格式化器 format= 0=短格式  1=长格式    1=数字  
const quarterFormatter = Formatter$1((value,format,$config)=>{
    const month = value.getMonth() + 1; 
    const quarter = Math.floor( ( month % 3 == 0 ? ( month / 3 ) : (month / 3 + 1 ) ));
    if(typeof(format)==='string'){ 
        format = ['short','long','number'].indexOf(format);        
    }
    if(format<0 && format>2) format = 0;
    return format==0 ? $config.short[quarter] : (format==1 ? $config.long[quarter] : quarter)
},{  
    normalize: toDate,                      
    params   : ['format'],
    configKey: "datetime.quarter"
});

// 月份格式化器 format可以取值0,1,2，也可以取字符串long,short,number
const monthFormatter = Formatter$1((value,format,$config)=>{
    const month = value.getMonth(); 
    if(typeof(format)==='string'){ 
        format = ['long','short','number'].indexOf(format);        
    }
    if(format<0 && format>2) format = 0;
    return format==0 ? $config.long[month] : (format==1 ? $config.short[month] : month+1)
},{  
    normalize: toDate,                      
    params   : ['format'],
    configKey: "datetime.month"
});

// 星期x格式化器  format可以取值0,1,2，也可以取字符串long,short,number
const weekdayFormatter = Formatter$1((value,format,$config)=>{
    const day = value.getDay();
    if(typeof(format)==='string'){ 
        format = ['long','short','number'].indexOf(format);        
    }
    if(format<0 && format>2) format = 0;
    return format==0 ? $config.long[day] : (format==1 ? $config.short[day] : day)
},{  
    normalize: toDate,                       
    params   : ['format'],
    configKey: "datetime.weekday"
});


// 时间格式化器 format可以取值0-local(默认),1-long,2-short,3-timestamp,也可以是一个插值表达式
const timeFormatter = Formatter$1((value,format,$config)=>{
    const optionals = ['local','long','short','timestamp'];      
    const optionIndex = optionals.findIndex((v,i)=>{
        if(typeof(format)=="string"){
            return v==format || v== format.toUpperCase()
        }else if(typeof(format)=="number"){
            return format === i
        }
    });
    switch(optionIndex){
        case 0: // local : toLocaleTimeString
            return value.toLocaleTimeString()
        case 1: // long
            return formatTime(value,$config.long) 
        case 2: // short
            return formatTime(value,$config.short) 
        case 3: // timestamp
            return value.getTime()
        default:
            return formatTime(value,format) 
    }  
},{  
    normalize: toDate,                       
    params   : ['format'],
    configKey: "datetime.time"
});

// 货币格式化器, CNY $13,456.00 
/**
 * { value | currency }
 * { value | currency('long') }
 * { value | currency('long',1) }  万元
 * { value | currency('long',2) }  亿元
 * { value | currency({symbol,unit,prefix,precision,suffix}) }
 */
const currencyFormatter = Formatter$1((value,...args) =>{
    // 1. 最后一个参数是格式化器的参数,不同语言不一样
    let $config = args[args.length-1];
    // 2. 从语言配置中读取默认参数
    let params = {  
        unit          : 0,         
        radix         : $config.radix,                          // 进制，取值,0-4,
        symbol        : $config.symbol,                         // 符号,即三位一进制，中文是是4位一进
        prefix        : $config.prefix,                         // 前缀
        suffix        : $config.suffix,                         // 后缀
        division      : $config.division,                       // ,分割位
        precision     : $config.precision,                      // 精度     
        format        : $config.format,                         // 模板字符串
    };   
    // 3. 从格式化器中传入的参数具有最高优先级，覆盖默认参数
    if(args.length==1) {   // 无参调用
        Object.assign(params,{format:'default'});
    }else if(args.length==2 && isPlainObject$3(args[0])){       // 一个参数且是{}
        Object.assign(params,{format:$config.custom},args[0]);
    }else if(args.length==2){            
        // 一个字符串参数，只能是default,long,short, 或者是一个模板字符串，如"{symbol}{value}{unit}"
        Object.assign(params,{format:args[0]});            
    }else if(args.length==3){// 2个参数，分别是format,unit
        Object.assign(params,{format:args[0],unit:args[1]});
    }else if(args.length==4){// 2个参数，分别是format,unit,precision
        Object.assign(params,{format:args[0],unit:args[1],precision:args[2]});
    }   
    // 4. 检查参数正确性
    params.unit = parseInt(params.unit) || 0;
    if(params.unit>4) params.unit = 4;
    if(params.unit<0) params.unit = 0;
    // 当指定unit大于0时取消小数点精度控制
    // 例 value = 12345678.99  默认情况下精度是2,如果unit=1,则显示1234.47+,
    // 将params.precision=0取消精度限制就可以显示1234.567899万，从而保证完整的精度
    // 除非显示将precision设置为>2的值
    if(params.unit>0 && params.precision==2){
        params.precision = 0;
    }

    // 模板字符串
    if(params.format in $config){
        params.format = $config[params.format];
    }     
    params.unitName =(Array.isArray($config.units) && params.unit> 0 && params.unit<$config.units.length) ? $config.units[params.unit] : "";
    return toCurrency(value,params)
},{
    normalize: toNumber$1, 
    configKey: "currency"
}); 



var en =   {
    // 配置参数
    $config:{
        datetime            : {
            units           : ["Year","Quarter","Month","Week","Day","Hour","Minute","Second","Millisecond","Microsecond"],
            date            :{
                long        : 'YYYY/MM/DD HH:mm:ss', 
                short       : "YYYY/MM/DD",
                format      : "local"
            },
            quarter         : {
                long        : ["First Quarter","Second Quarter","Third Quarter","Fourth Quarter"],
                short       : ["Q1","Q2","Q3","Q4"],
                format      : "short"
            },
            month:{
                long        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                short       : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                format      : 0           // 0-长名称，1-短名称，2-数字
            },
            weekday:{
                long        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                short       : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
                format      : 0,            // 0-长名称，1-短名称，2-数字   
            },       
            time            : {
                long        : "HH:mm:ss",
                short       : "HH:mm:ss",
                format      : 'local'
            },   
        },
        currency          : {
            default       : "{symbol}{value}{unit}",
            long          : "{prefix} {symbol}{value}{unit}{suffix}", 
            short         : "{symbol}{value}{unit}",
            custom        : "{prefix} {symbol}{value}{unit}{suffix}", 
            //--
            units         : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
            radix         : 3,                       // 进制，即三位一进制，中文是是4位一进
            symbol        : "$",                     // 符号
            prefix        : "USD",                   // 前缀
            suffix        : "",                      // 后缀
            division      : 3,                       // ,分割位
            precision     : 2,                    // 精度            
            
        },
        number            : {
            division      : 3,
            precision     : 2
        },
        empty:{
            //values        : [],                   // 可选，定义空值，如果想让0,''也为空值，可以指定values=[0,'']
            escape        : "",                     // 当空值时显示的备用值
            next          : 'break'                 // 当空值时下一步的行为: break=中止;skip=跳过
        },
        error             : {
            //当错误时显示的内容，支持的插值变量有message=错误信息,error=错误类名,也可以是一个返回上面内容的同步函数
            escape        : null,                   // 默认当错误时显示空内容
            next          : 'break'                 // 当出错时下一步的行为: break=中止;skip=忽略
        },
        fileSize:{
            //brief: ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"],
            //whole:["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"],
            //precision: 2 // 小数精度
        }
    },
    // 默认数据类型的格式化器
    $types: {
        Date     : dateFormatter,
        //value => { const d = toDate(value); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` },
        Null     : value =>"",
        Undefined: value =>"",
        Error    : value => "ERROR",
        Boolean  : value =>value ? "True":"False"                
    },
    // 以下是格式化定义
    // ******************* 日期 *******************
    date          : dateFormatter,
    time          : timeFormatter,
    year          : value => toDate(value).getFullYear(),
    quarter       : quarterFormatter,
    month         : monthFormatter,
    weekday       : weekdayFormatter,
    day           : value => toDate(value).getDate(),
    // ******************* 时间 *******************
    hour          : value => toDate(value).getHours(),
    hour12        : value => {const hour = toDate(value).getHours(); return hour > 12 ? hour - 12 : thour},
    minute        : value => toDate(value).getMinutes(),
    second        : value => toDate(value).getSeconds(),
    millisecond   : value => toDate(value).getMilliseconds(),
    timestamp     : value => toDate(value).getTime(),
    // ******************* 货币 ******************* 
    currency     : currencyFormatter,
    // 数字,如，使用分割符
    number       : (value, division = 3,precision = 0) => toCurrency(value, { division, precision})
};

/**
 * 
 * 处理中文数字和货币相关
 * 
 */

const { isNumber: isNumber$2 } = utils;

const CN_DATETIME_UNITS$1 =  ["年","季度","月","周","日","小时","分钟","秒","毫秒","微秒"];
const CN_WEEK_DAYS$1 = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
const CN_SHORT_WEEK_DAYS$1  =["日","一","二","三","四","五","六"];
const CN_MONTH_NAMES$1=  ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const CN_SHORT_MONTH_NAMES$1 = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];

 const CN_NUMBER_DIGITS     = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
 const CN_NUMBER_UNITS      = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千', '京', '十', '百', '千', '垓'];
 const CN_NUMBER_BIG_DIGITS = ["零", '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
 const CN_NUMBER_BIG_UNITS  = ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億', '拾', '佰', '仟', '兆', '拾', '佰', '仟', '京', '拾', '佰', '仟', '垓'];
 

 /**
 * 
  * 将数字转换为中文数字
  * 
  * 注意会忽略掉小数点后面的数字
  * 
  * @param {*} value  数字
  * @param {*} isBig 是否大写数字 
  * @returns 
  */
function toChineseNumber$1(value,isBig) {   
     if(!isNumber$2(value)) return value;
     let [wholeValue,decimalValue] = String(value).split("."); // 处理小数点     
     const DIGITS = isBig ? CN_NUMBER_BIG_DIGITS : CN_NUMBER_DIGITS;
     const UNITS = isBig ? CN_NUMBER_BIG_UNITS : CN_NUMBER_UNITS; 
     let result = '';
     if(wholeValue.length==1) return DIGITS[parseInt(wholeValue)]
     for(let i=wholeValue.length-1; i>=0; i--){
         let bit = parseInt(wholeValue[i]);
         let digit = DIGITS[bit];
         let unit = UNITS[wholeValue.length-i-1];
         if(bit==0){
             let preBit =i< wholeValue.length ? parseInt(wholeValue[i+1]) : null;// 上一位
             let isKeyBits = ((wholeValue.length-i-1) % 4)==0;
             if(preBit && preBit!=0 && !isKeyBits) result =  "零" + result;
             if(isKeyBits) result = UNITS[wholeValue.length-i-1] + result;
         }else {
             result=`${digit}${unit}` + result;
         }        
     } 
     if(isBig){
         result = result.replace("垓京","垓")
                     .replace("京兆","京")
                     .replace("兆億","兆")
                     .replace("億萬","億")
                     .replace("萬仟","萬"); 
     }else {
         result = result.replace("垓京","垓")
                     .replace("京兆","京")
                     .replace("兆亿","兆")
                     .replace("亿万","亿")
                     .replace("万千","万"); 
         if(result.startsWith("一十")) result=result.substring(1);
     }    
     return result    // 中文数字忽略小数部分
 } 
  
 function toChineseBigNumber(value) {
    return toChineseNumber$1(value,true)
 }
 /**
  * 转换为中文大写货币
  * @param {*} value 
  * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
  * @param {*} prefix      前缀 
  * @param {*} suffix      后缀
  * @param {*} precision   小数点精确到几位
  */
function toChineseCurrency$1(value,{big=false,prefix="",unit="元",suffix=""}={}){
    let [wholeValue,decimalValue] = String(value).split(".");
    let result; 
    if(big){
        result = toChineseBigNumber(wholeValue)+unit;
    }else {
        result = toChineseNumber$1(wholeValue)+unit;
    }    
    if(decimalValue){
        if(decimalValue[0]) result =result+  CN_NUMBER_DIGITS[parseInt(decimalValue[0])]+"角";
        if(decimalValue[1]) result =result+  CN_NUMBER_DIGITS[parseInt(decimalValue[1])]+"分";        
    }
    return prefix+result+suffix
}

 var cnutils ={ 
    toChineseCurrency: toChineseCurrency$1,
    toChineseNumber: toChineseNumber$1,
    toChineseBigNumber,
    CN_DATETIME_UNITS: CN_DATETIME_UNITS$1,
    CN_WEEK_DAYS: CN_WEEK_DAYS$1,
    CN_SHORT_WEEK_DAYS: CN_SHORT_WEEK_DAYS$1,
    CN_MONTH_NAMES: CN_MONTH_NAMES$1,
    CN_SHORT_MONTH_NAMES: CN_SHORT_MONTH_NAMES$1,
    CN_NUMBER_DIGITS,
    CN_NUMBER_UNITS,
    CN_NUMBER_BIG_DIGITS,
    CN_NUMBER_BIG_UNITS
};

/**
 *   简体中文格式化器
 * 
 */

const { toChineseCurrency,toChineseNumber,CN_DATETIME_UNITS,CN_WEEK_DAYS,CN_SHORT_WEEK_DAYS, CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES} = cnutils; 
 
var zh = {
    // 配置参数: 格式化器函数的最后一个参数就是该配置参数
    $config:{
        datetime          : {
            units         : CN_DATETIME_UNITS,
            date            :{
                long        : 'YYYY年MM月DD日 HH点mm分ss秒',       
                short       : "YYYY/MM/DD",                          
                format      : 'local'
            },
            quarter         : {
                long        : ["一季度","二季度","三季度","四季度"],
                short       : ["Q1","Q2","Q3","Q4"],
                format      : "short"          // 0-短格式,1-长格式,2-数字
            },
            month:{
                long       : CN_MONTH_NAMES,
                short       : CN_SHORT_MONTH_NAMES,
                format      : 0,           // 0-长名称，1-短名称，2-数字
            },
            weekday:{
                short       : CN_WEEK_DAYS,
                long        : CN_SHORT_WEEK_DAYS,
                format      : 0,            // 0-长名称，1-短名称，2-数字   
            },
            time:{
                long        : "HH点mm分ss秒",
                short       : "HH:mm:ss",
                format      : 'local'
            }
        },

        currency          : {
            units         : ["","万","亿","万亿","万万亿"],
            radix         : 4,                       // 进制，即三位一进制，中文是是4位一进
            symbol        : "￥",
            prefix        : "RMB",
            suffix        : "元",
            division      : 4,
            precision     : 2            
        },
        number            : {
            division      : 3,
            precision     : 2
        }
    },
    $types: {
        Boolean  : value =>value ? "是":"否"
    },
    // 中文货币，big=true代表大写形式
    rmb     :   (value,big,unit="元",prefix,suffix)=>toChineseCurrency(value,{big,prefix,suffix,unit}),
    // 中文数字,如一千二百三十一
    number  :(value,isBig)=>toChineseNumber(value,isBig)
};

const { toNumber,isFunction: isFunction$3 } = utils;


/**
  *   字典格式化器
  *   根据输入data的值，返回后续参数匹配的结果
  *   dict(data,<value1>,<result1>,<value2>,<result1>,<value3>,<result1>,...)
  *   
  * 
  *   dict(1,1,"one",2,"two",3,"three"，4,"four") == "one"
  *   dict(2,1,"one",2,"two",3,"three"，4,"four") == "two"
  *   dict(3,1,"one",2,"two",3,"three"，4,"four") == "three"
  *   dict(4,1,"one",2,"two",3,"three"，4,"four") == "four"
  *   // 无匹配时返回原始值
  *   dict(5,1,"one",2,"two",3,"three"，4,"four") == 5  
  *   // 无匹配时并且后续参数个数是奇数，则返回最后一个参数
  *   dict(5,1,"one",2,"two",3,"three"，4,"four","more") == "more"  
  * 
  *   在翻译中使用
  *   I have { value | dict(1,"one",2,"two",3,"three",4,"four")} apples
  * 
  *  为什么不使用 {value | dict({1:"one",2:"two",3:"three",4:"four"})}的形式更加自然？
  * 
  *  因为我们是采用正则表达式来对格式化器的语法进行解释的，目前无法支持复杂的数据类型，只能支持简单的形式
  * 
  * 
  * @param {*} value 
  * @param  {...any} args 
  * @returns 
  */
 function dict(value, ...args) {
     for (let i = 0; i < args.length; i += 2) {
         if (args[i] === value) {
             return args[i + 1]
         }
     }
     if (args.length > 0 && (args.length % 2 !== 0)) return args[args.length - 1]
     return value
 }
 
/**
 * 
 * 空值： null,undefined
 * 
 * 当输入空值时的处理逻辑
 * 
 * { value | empty }  ==  转换显示为''，并且忽略
 * { value | empty('无') }  == 无
 * { value | unit('KB') | empty('0') } ==  0KB     
 * 
 * 有时在处理其他类型时，可能希望将0或者''也视为空值 
 * { value | empty('没钱了') } == 
 * 
 * 
 * @param {*} value 
 * @param {String} escapeValue
 * @paran {String} next 下一步行为，取值true/false,break,skip,默认是break
 * @param {*} config 
 */
 function empty(value,escapeValue,next,config) {
    let opts = Object.assign({escape:"",next:'break',values:[]},config.empty || {});             
    if(escapeValue!=undefined) opts.escape = escapeValue;
    let emptyValues = [undefined,null];
    if(Array.isArray(opts.values)) emptyValues.push(...opts.values);    
    if(emptyValues.includes(value)){                  
        return {value:opts.escape,next: opts.next}
    }else {
        return value
    }
}
empty.paramCount = 2; 

/**
* 当执行格式化器出错时的显示内容.

{ value | error }                       ==  默认
{ value | error('') }                   == 显示空字符串
{ value | error('ERROR') }              == 显示ERROR字样
{ value | error('ERROR:{ message}') }   == 显示error.message
{ value | error('ERROR:{ error}') }     == 显示error.constructor.name
{ value | error('ERROR:{ error}',) }     == 显示error.constructor.name


 * @param {*} value 
 * @param {*} escapeValue 
 * @param {*} next   下一步的行为，取值，break,ignore
 * @param {*} config 格式化器的全局配置参数
 * @returns 
 */
function error(value,escapeValue,next,config) {    
    if(value instanceof Error){     
        if(scope.debug) console.error(`Error while execute formatter<${value.formatter}>:`,e);
        const scope = this;
        try{
            let opts = Object.assign({escape:null,next:'break'},config.error || {});
            if(escapeValue!=undefined) opts.escape = escapeValue;
            if(next!=undefined) opts.next = next;
            return {
                value : opts.escape ? String(opts.escape).replace(/\{\s*message\s*\}/g,value.message).replace(/\{\s*error\s*\}/g,value.constructor.name) : null,
                next  : opts.next
            }
        }catch(e){
            if(scope.debug) console.error(`Error while execute formatter:`,e.message);
        } 
        return value
    }else {
        return value
    }
}
error.paramCount = 2;            // 声明该格式化器支持两个参数 

/**
 * 添加前缀
 * @param {*} value 
 * @param {*} prefix 
 * @returns 
 */
function prefix(value,prefix="") {
    return prefix ?  `${prefix}${value}` : value
}
/**
 * 添加后缀
 * @param {*} value 
 * @param {*} suffix 
 * @returns 
 */
function suffix(value,suffix="") {
    return suffix ?  `${value}${suffix}` : value
}

 const FILE_SIZE_SECTIONS = [
    0,
    1024,
    1048576,
    1073741824,
    1099511627776,
    1125899906842624,
    1152921504606847000,
    1.1805916207174113e+21,
    1.2089258196146292e+24,
    1.2379400392853803e+27,
    1.2676506002282294e+30
  ];
const FILE_SIZE_BRIEF_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"]; 
const FILE_SIZE_WHOLE_UNITS = ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"];

/**
 * 输出文件大小
 *
 * { value | fileSize }  
 * { value | fileSize('KB') }  
 * { value | fileSize('MB') }  
 * 
 * @param {*} value 
 * @param {*} unit   单位，未指定时采用自动方式，即<1024用字节，1024<v<1024*1024显示KB,...
 * @param {*} brief 
 * @param {*} options 
 */
function filesize(value,unit,brief=true,options={}){
    let opts = Object.assign({
        precision: 2,
        brief    : FILE_SIZE_BRIEF_UNITS,
        whole    : FILE_SIZE_WHOLE_UNITS
    },options.fileSize || {});
    let v = toNumber(value);
    let unitIndex;
    if(unit==undefined || unit=="auto"){
        unitIndex = FILE_SIZE_SECTIONS.findIndex(x=>v<x) - 1;
    }else {
        unit = unit.toUpperCase();
        unitIndex =["B","BYTE","BYTES"].includes(unit) ? 0 : FILE_SIZE_BRIEF_UNITS.indexOf(unit);
    }
    if(unitIndex<0 || unitIndex>=FILE_SIZE_BRIEF_UNITS.length) unitIndex= 0;
    let result = (unitIndex == 0 ? v : v / FILE_SIZE_SECTIONS[unitIndex]).toFixed(opts.precision);
    if( unitIndex>0 && (v % FILE_SIZE_SECTIONS[unitIndex])!==0) result = result+"+"; 
    // 去除尾部的0
    while(["0","."].includes(result[result.length-1])){
        result = result.substring(0, result.length-2); 
    } 
    return  brief ? `${result} ${opts.brief[unitIndex]}` : `${result} ${opts.brief[whole]}`
}
filesize.paramCount = 2; 




var _default = {
    dict,
    prefix,
    suffix,
    filesize,
    error,
    empty
};

/**
 *    内置的格式化器 
 *    被注册到全局语言管理器
 */

const enFormatters     = en; 
const zhFormatters     = zh; 
const defaultFormatters = _default;
 
var formatters = {
    "*":{
        ...enFormatters,
        ...defaultFormatters
    },
    zh:zhFormatters
};

const { isPlainObject: isPlainObject$2, isFunction: isFunction$2, getByPath, deepMixin: deepMixin$1,deepClone } = utils;

const DataTypes$1 = [
	"String",
	"Number",
	"Boolean",
	"Object",
	"Array",
	"Function",
	"Null",
	"Undefined",
	"Symbol",
	"Date",
	"RegExp",
	"Error",
];

var scope = class i18nScope {
	constructor(options = {}, callback) {
		this._id              = options.id || Date.now().toString() + parseInt(Math.random() * 1000);
		this._debug           = options.debug == undefined ? process && process.env && process.env.NODE_ENV === "development" : options.debug; 		// 当出错时是否在控制台台输出错误信息
		this._languages       = options.languages;                          // 当前作用域支持的语言列表
		this._defaultLanguage = options.defaultLanguage || "zh";            // 默认语言名称
		this._activeLanguage  = options.activeLanguage;                     // 当前语言名称
		this._default         = options.default;                            // 默认语言包
		this._messages        = options.messages;                           // 当前语言包
		this._idMap           = options.idMap;                              // 消息id映射列表
		this._formatters      = options.formatters;                         // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
		this._loaders         = options.loaders;                            // 异步加载语言文件的函数列表
		this._global          = null;                                       // 引用全局VoerkaI18n配置，注册后自动引用
		this._patchMessages   = {};                                         // 语言包补丁信息{<language>: {....},<language>:{....}}
		this._refreshing      = false;		                                // 正在加载语言包标识
        // 用来缓存格式化器的引用，当使用格式化器时可以直接引用，减少检索遍历
		this.$cache = {
			activeLanguage : null,
			typedFormatters: {},
			formatters     : {},
		};
		// 如果不存在全局VoerkaI18n实例，说明当前Scope是唯一或第一个加载的作用域，则自动创建全局VoerkaI18n实例
		if (!globalThis.VoerkaI18n) {
			const { I18nManager } = runtime;
			globalThis.VoerkaI18n = new I18nManager({
				debug          : this._debug,
				defaultLanguage: this._defaultLanguage,
				activeLanguage : this._activeLanguage,
				languages      : options.languages,
			});
		}
		this._global = globalThis.VoerkaI18n;        
        this._initFormatters(this.activeLanguage);                       // 初始化活动的格式化器        
		this._mergePatchedMessages();                                   // 从本地缓存中读取并合并补丁语言包
		this._patch(this._messages, this.activeLanguage);               // 延后执行补丁命令，该命令会向远程下载补丁包
		this.register(callback);		                                // 在全局注册作用域
	}	
	get id() {return this._id;}                                         // 作用域唯一id	
	get debug() {return this._debug;}                                   // 调试开关	
    get defaultLanguage() {return this._defaultLanguage;}               // 默认语言名称	
	get activeLanguage() {return this._global.activeLanguage;}                 // 默认语言名称	
	get default() {return this._default;}                               // 默认语言包	
	get messages() {return this._messages;	}                           // 当前语言包	
	get idMap() {return this._idMap;}                                   // 消息id映射列表	
	get languages() {return this._languages;}                           // 当前作用域支持的语言列表[{name,title,fallback}]	
	get loaders() {	return this._loaders;}                              // 异步加载语言文件的函数列表	
	get global() {	return this._global;}                               // 引用全局VoerkaI18n配置，注册后自动引用    
	get formatters() {	return this._formatters;}                       // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
	get activeFormatters() {return this._activeFormatters}              // 当前作用域激活的格式化器定义 {$types,$config,[格式化器名称]: ()                       = >{},[格式化器名称]: ()          = >{}}   
    get activeFormatterConfig(){return this._activeFormatterConfig}     // 当前格式化器合并后的配置参数，参数已经合并了全局格式化器中的参数

	/**
	 * 在全局注册作用域当前作用域
	 * @param {*} callback   注册成功后的回调
	 */
	register(callback) {
		if (!isFunction$2(callback)) callback = () => {};
		this.global.register(this).then(callback).catch(callback);
	}
	/**
     * 注册格式化器
     * 
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatter(name,value=>{...})                                 // 注册到所有语言
     * registerFormatter(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * registerFormatter(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
       registerFormatter("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
       registerFormatter(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
       registerFormatter(name,value=>{...},{langauge:"zh,cht"})
     * @param {*} formatter            格式化器
        language : 字符串或数组，声明该格式化器适用语言
           *代表适用于所有语言
           语言名称，语言名称数组，或者使用,分割的语言名称字符串
        asGlobal : 注册到全局
     */
	registerFormatter(name, formatter, { language = "*", global : asGlobal } = {}) {
		if (!isFunction$2(formatter) || typeof name !== "string") {
			throw new TypeError("Formatter must be a function");
		}
		language = Array.isArray(language)
			? language
			: language
			? language.split(",")
			: [];
		if (asGlobal) {
			this.global.registerFormatter(name, formatter, { language });
		} else {
			language.forEach((lng) => {
				if (DataTypes$1.includes(name)) {
					this._formatters[lng].$types[name] = formatter;
				} else {
					this._formatters[lng][name] = formatter;
				}
			});
		}
	}
    /**
     * 注册多种格式化器
     * registerFormatters(={"*",zh:{...},en:{...}})
     *  registerFormatters(={"*",zh:{...},en:{...}},true) 在全局注册
     * @param {*} formatters ={"*",zh:{...},en:{...}}
     * @returns 
     */
    registerFormatters(formatters,asGlobal=false) {
        Object.entries(formatters).forEach(([language,fns])=>{
            Object.entries(fns).forEach(([name,formatter])=>{
                this.registerFormatter(name,formatter,{language,global:asGlobal});
            });            
        }); 
    }
	/**
	 * 注册默认文本信息加载器
	 * @param {Function} 必须是异步函数或者是返回Promise
	 */
	registerDefaultLoader(fn) {
		this.global.registerDefaultLoader(fn);
	}
	/**
	 * 获取指定语言信息
	 * @param {*} language
	 * @returns
	 */
	getLanguage(language) {
		let index = this._languages.findIndex((lng) => lng.name == language);
		if (index !== -1) return this._languages[index];
	}
	/**
	 * 返回是否存在指定的语言
	 * @param {*} language 语言名称
	 * @returns
	 */
	hasLanguage(language) {
		return this._languages.indexOf((lang) => lang.name == language) !== -1;
	}
	/**
	 * 回退到默认语言
	 */
	_fallback() {
		this._messages = this._default;
		this._activeLanguage = this.defaultLanguage;
	}
    /**
     * 初始化格式化器
     * 激活和默认语言的格式化器采用静态导入的形式，而没有采用异步块的形式，这是为了确保首次加载时的能马上读取，而不能采用延迟加载方式
     * _activeFormatters={$config:{...},$types:{...},[格式化器名称]:()=>{...},[格式化器名称]:()=>{...},...}}
     */
    _initFormatters(newLanguage){
        this._activeFormatters = {};
		try {
			if (newLanguage in this._formatters) {
				this._activeFormatters = this._formatters[newLanguage];
			} else {
				if (this._debug) console.warn(`Not initialize <${newLanguage}> formatters.`);
			}
            this._generateFormatterConfig(newLanguage);
		} catch (e) {
			if (this._debug) console.error(`Error while initialize ${newLanguage} formatters: ${e.message}`);
		}
    }

	/**
	 * 
     * 切换到对应语言的格式化器
     * 
     * 当切换语言时，格式化器应该切换到对应语言的格式化器
     * 
     * 重要需要处理：
     *   $config参数采用合并继承机制,从全局读取
     * 
     * 
	 * @param {*} language
	 */
	async _changeFormatters(newLanguage) {
		try {
			if (newLanguage in this._formatters) {
				let loader = this._formatters[newLanguage];
				if (isPlainObject$2(loader)) {
					this._activeFormatters = loader;
				} else if (isFunction$2(loader)) {
					this._activeFormatters = (await loader()).default;
				}
                // 合并生成格式化器的配置参数,当执行格式化器时该参数将被传递给格式化器
                this._generateFormatterConfig(newLanguage);
			} else {
				if (this._debug) console.warn(`Not configured <${newLanguage}> formatters.`);
			}
		} catch (e) {
			if (this._debug) console.error(`Error loading ${newLanguage} formatters: ${e.message}`);
		}
	}
    /**
     * 生成格式化器的配置参数，该参数由以下合并而成：
     *  - global.formatters[*].$config
     *  - global.formatters[language].$config
     *  - scope.activeFormatters.$config   当前优先
     */
    _generateFormatterConfig(language){
        let options; 
        try{
            options = deepClone(getByPath(this._global.formatters,`*.$config`,{}));
            deepMixin$1(options,getByPath(this._global.formatters,`${language}.$config`,{}));
            deepMixin$1(options,getByPath(this._activeFormatters,"$config",{}));
        }catch(e){
            if(this.debug) console.error(`Error while generate <${language}> formatter options: `,e);
            if(!options) options = this._activeFormatters.$config || {};
        }        
        return this._activeFormatterConfig = options
    }
	/**
	 * 刷新当前语言包
	 * @param {*} newLanguage
	 */
	async refresh(newLanguage) {
		this._refreshing = true;
		if (!newLanguage) newLanguage = this.activeLanguage;
		// 默认语言：由于默认语言采用静态加载方式而不是异步块,因此只需要简单的替换即可
		if (newLanguage === this.defaultLanguage) {
			this._messages = this._default;
			await this._patch(this._messages, newLanguage); // 异步补丁
			await this._changeFormatters(newLanguage);
			return;
		}
		// 非默认语言需要异步加载语言包文件,加载器是一个异步函数
		// 如果没有加载器，则无法加载语言包，因此回退到默认语言
		let loader = this.loaders[newLanguage];
		try {
            let newMessages, useRemote =false;
			if (isPlainObject$2(loader)) {                // 静态语言包
				newMessages = loader;
			} else if (isFunction$2(loader)) {            // 语言包异步chunk
				newMessages = (await loader()).default;
			} else if (isFunction$2(this.global.defaultMessageLoader)) { // 从远程加载语言包:如果该语言没有指定加载器，则使用全局配置的默认加载器
				const loadedMessages = await this.global.loadMessagesFromDefaultLoader(newLanguage,this);                
                if(isPlainObject$2(loadedMessages)){
                    useRemote = true;
                    // 需要保存动态语言包中的$config，合并到对应语言的格式化器配置
                    if(isPlainObject$2(loadedMessages.$config)){                        
                        this._formatters[newLanguage] = {
                            $config  : loadedMessages.$config
                        };
                        delete loadedMessages.$config;
                    }
                    newMessages = Object.assign({},this._default,loadedMessages);
                }
			} 
            if(newMessages){
                this._messages = newMessages;
                this._activeLanguage = newLanguage;       
                // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了
                if(!useRemote) {
                    await this._patch(this._messages, newLanguage);                    
                }
                // 切换到对应语言的格式化器
			    await this._changeFormatters(newLanguage);        
            }else {
                this._fallback();
            }

		} catch (e) {
			if (this._debug) console.warn(`Error while loading language <${newLanguage}> on i18nScope(${this.id}): ${e.message}`);
			this._fallback();
		} finally {
			this._refreshing = false;
		}
	}
	/**
	 * 当指定了默认语言包加载器后，会从服务加载语言补丁包来更新本地的语言包
	 *
	 * 补丁包会自动存储到本地的LocalStorage中
	 *
	 * @param {*} messages
	 * @param {*} newLanguage
	 * @returns
	 */
	async _patch(messages, newLanguage) {
		if (!isFunction$2(this.global.loadMessagesFromDefaultLoader)) return;
		try {
			let pachedMessages = await this.global.loadMessagesFromDefaultLoader(newLanguage,this);
			if (isPlainObject$2(pachedMessages)) {
				Object.assign(messages, pachedMessages);
				this._savePatchedMessages(pachedMessages, newLanguage);
			}
		} catch (e) {
			if (this._debug) console.error(`Error while loading <${newLanguage}> patch messages from remote:`,e);
		}
	}
	/**
	 * 从本地存储中读取语言包补丁合并到当前语言包中
	 */
	_mergePatchedMessages() {
		let patchedMessages = this._getPatchedMessages(this.activeLanguage);
		if (isPlainObject$2(patchedMessages)) {
			Object.assign(this._messages, patchedMessages);
		}
	}
	/**
	 * 将读取的补丁包保存到本地的LocalStorage中
	 *
	 * 为什么要保存到本地的LocalStorage中？
	 *
	 * 因为默认语言是静态嵌入到源码中的，而加载语言包补丁是延后异步的，
	 * 当应用启动第一次就会渲染出来的是没有打过补丁的内容。
	 *
	 * - 如果还需要等待从服务器加载语言补丁合并后再渲染会影响速度
	 * - 如果不等待从服务器加载语言补丁就渲染，则会先显示未打补丁的内容，然后在打完补丁后再对应用进行重新渲染生效
	 *   这明显不是个好的方式
	 *
	 * 因此，采用的方式是：
	 * - 加载语言包补丁后，将之保存到到本地的LocalStorage中
	 * - 当应用加载时会查询是否存在补丁，如果存在就会合并渲染
	 *
	 * @param {*} messages
	 */
	_savePatchedMessages(messages, language) {
		try {
			if (globalThis.localStorage) {
				globalThis.localStorage.setItem(`voerkai18n_${this.id}_${language}_patched_messages`,JSON.stringify(messages));
			}
		} catch (e) {
			if (this.$cache._debug)	console.error("Error while save voerkai18n patched messages:",e);
		}
	}
	/**
	 * 从本地缓存中读取补丁语言包
	 * @param {*} language
	 * @returns
	 */
	_getPatchedMessages(language) {
		try {
			return JSON.parse(localStorage.getItem(`voerkai18n_${this.id}_${language}_patched_messages`));
		} catch (e) {
			return {};
		}
	}
	// 以下方法引用全局VoerkaI18n实例的方法
	on() {return this._global.on(...arguments);	}
	off() {return this._global.off(...arguments); }
	offAll() {return this._global.offAll(...arguments);}
	async change(language) {
        await this._global.change(language);
    }
};

const {isNumber: isNumber$1,isPlainObject: isPlainObject$1,isFunction: isFunction$1} = utils;
const { replaceInterpolatedVars: replaceInterpolatedVars$1 } = interpolate;

/**
 * 文本id必须是一个数字
 * @param {*} content 
 * @returns 
 */
 function isMessageId(content){
    return isNumber$1(content)
}
/**
 * 根据值的单数和复数形式，从messages中取得相应的消息
 * 
 * @param {*} messages  复数形式的文本内容 = [<=0时的内容>，<=1时的内容>，<=2时的内容>,...]
 * @param {*} value 
 */
function getPluraMessage(messages,value){
    try{
        if(Array.isArray(messages)){
            return messages.length > value ? messages[value] : messages[messages.length-1]
       }else {
           return messages
       }
    }catch{
        return Array.isArray(messages) ? messages[0] : messages
    }
}

/**
 * 翻译函数
 * 
* translate("要翻译的文本内容")                                 如果默认语言是中文，则不会进行翻译直接返回
* translate("I am {} {}","man") == I am man                    位置插值
* translate("I am {p}",{p:"man"})                              字典插值
* translate("total {$count} items", {$count:1})  //复数形式 
* translate("total {} {} {} items",a,b,c)  // 位置变量插值
 * 
 * this===scope  当前绑定的scope
 * 
 */
function translate$1(message) { 
    const scope = this;
    const activeLanguage = scope.global.activeLanguage; 
    let content = message;
    let vars=[];                 // 插值变量列表
    let pluralVars= [];          // 复数变量
    let pluraValue = null;       // 复数值
    if(!typeof(message)==="string") return message
    try{
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(arguments.length === 2 && isPlainObject$1(arguments[1])){
            Object.entries(arguments[1]).forEach(([name,value])=>{
                if(isFunction$1(value)){
                    try{
                        vars[name] = value();
                    }catch(e){
                        vars[name] = value;
                    }
                } 
                // 以$开头的视为复数变量
                if(name.startsWith("$") && typeof(vars[name])==="number")  pluralVars.push(name);
            });
            vars = [arguments[1]];
        }else if(arguments.length >= 2){
            vars = [...arguments].splice(1).map((arg,index)=>{
                try{
                    arg = isFunction$1(arg) ? arg() : arg;                    
                    // 位置参数中以第一个数值变量为复数变量
                    if(isNumber$1(arg)) pluraValue = parseInt(arg);    
                }catch(e){ }
                return arg   
            });
            
        }

        // 3. 取得翻译文本模板字符串
        if(activeLanguage === scope.defaultLanguage){
            // 2.1 从默认语言中取得翻译文本模板字符串
            // 如果当前语言就是默认语言，不需要查询加载，只需要做插值变换即可
            // 当源文件运用了babel插件后会将原始文本内容转换为msgId
            // 如果是msgId则从scope.default中读取,scope.default=默认语言包={<id>:<message>}
            if(isMessageId(content)){
                content = scope.default[content] || message;
            }
        }else { 
            // 2.2 从当前语言包中取得翻译文本模板字符串
            // 如果没有启用babel插件将源文本转换为msgId，需要先将文本内容转换为msgId
            let msgId = isMessageId(content) ? content :  scope.idMap[content];  
            content = scope.messages[msgId] || content;
        }
         // 2. 处理复数
        // 经过上面的处理，content可能是字符串或者数组
        // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
        // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
        if(Array.isArray(content) && content.length>0){
            // 如果存在复数命名变量，只取第一个复数变量
            if(pluraValue!==null){  // 启用的是位置插值,pluraIndex=第一个数字变量的位置
                content = getPluraMessage(content,pluraValue);
            }else if(pluralVar.length>0){
                content = getPluraMessage(content,parseInt(vars(pluralVar[0])));
            }else { // 如果找不到复数变量，则使用第一个内容
                content = content[0];
            }
        }         
        // 进行插值处理
        if(vars.length==0){
            return content
        }else {
            return replaceInterpolatedVars$1.call(scope,content,...vars)
        }        
    }catch(e){
        return content       // 出错则返回原始文本
    } 
}
 


var translate_1 = {
    translate: translate$1
};

const {getDataTypeName,isNumber,isPlainObject,isFunction,isNothing,deepMerge,deepMixin} = utils;
const {getInterpolatedVars,replaceInterpolatedVars} = interpolate;
const {createFormatter,Formatter} = formatter$1;
const EventEmitter = eventemitter;
const inlineFormatters = formatters;         
const i18nScope = scope;
const { translate } = translate_1;


const DataTypes =  ["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"];
 
// 默认语言配置
const defaultLanguageSettings = {  
    debug          : true,
    defaultLanguage: "zh",
    activeLanguage : "zh",
    formatters     : inlineFormatters,
    languages      : [
        {name:"zh",title:"中文",default:true},
        {name:"en",title:"英文"}
    ]
};

/** 
 * 多语言管理类
 * 
 * 当导入编译后的多语言文件时(import("./languages"))，会自动生成全局实例VoerkaI18n
 *  
 * VoerkaI18n.languages             // 返回支持的语言列表
 * VoerkaI18n.defaultLanguage       // 默认语言
 * VoerkaI18n.language              // 当前语言
 * VoerkaI18n.change(language)      // 切换到新的语言 
 * 
 * 
 * VoerkaI18n.on("change",(language)=>{})  // 注册语言切换事件
 * VoerkaI18n.off("change",(language)=>{}) 
 * 
 * */ 
 class I18nManager extends EventEmitter{
    constructor(settings={}){
        super();
        if(I18nManager.instance!=null){
            return I18nManager.instance;
        }
        I18nManager.instance = this;
        this._settings = deepMerge(defaultLanguageSettings,settings);
        this._scopes=[];                     // 保存i18nScope实例
        this._defaultMessageLoader = null;   // 默认语言包加载器
    }
    get settings(){ return this._settings }                         // 配置参数
    get scopes(){ return this._scopes }                             // 注册的报有i18nScope实例q   
    get activeLanguage(){ return this._settings.activeLanguage}     // 当前激活语言    名称
    get defaultLanguage(){ return this._settings.defaultLanguage}   // 默认语言名称    
    get languages(){ return this._settings.languages}               // 支持的语言列表    
    get formatters(){ return this._settings.formatters }            // 内置格式化器{*:{$config,$types,...},zh:{$config,$types,...},en:{$config,$types,...}}
    get defaultMessageLoader(){ return this._defaultMessageLoader}  // 默认语言包加载器

    // 通过默认加载器加载文件
    async loadMessagesFromDefaultLoader(newLanguage,scope){
        if(!isFunction(this._defaultMessageLoader))  return //throw new Error("No default message loader specified")
        return  await this._defaultMessageLoader.call(scope,newLanguage,scope)        
    }
    /**
     *  切换语言
     */
    async change(language){
        if(this.languages.findIndex(lang=>lang.name === language)!==-1 || isFunction(this._defaultMessageLoader)){
            await this._refreshScopes(language);                        // 通知所有作用域刷新到对应的语言包
            this._settings.activeLanguage = language;            
            await this.emit(language);                                  // 触发语言切换事件
        }else {
            throw new Error("Not supported language:"+language)
        }
    }
    /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
    async _refreshScopes(newLanguage){ 
        try{
            const scopeRefreshers = this._scopes.map(scope=>{
                return scope.refresh(newLanguage)
            });
            if(Promise.allSettled){
               await Promise.allSettled(scopeRefreshers);
            }else {
                await Promise.all(scopeRefreshers);
            } 
        }catch(e){
            console.warn("Error while refreshing i18n scopes:",e.message);
        }          
    }
    /**
     * 
     * 注册一个新的作用域
     * 
     * 每一个库均对应一个作用域，每个作用域可以有多个语言包，且对应一个翻译函数
     * 除了默认语言外，其他语言采用动态加载的方式
     * 
     * @param {*} scope 
     */
    async register(scope){
        if(!(scope instanceof i18nScope)){
            throw new TypeError("Scope must be an instance of I18nScope")
        }
        this._scopes.push(scope); 
        await scope.refresh(this.activeLanguage); 
    }
    /**
     * 注册全局格式化器
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatter(name,value=>{...})                                 // 注册到所有语言
     * registerFormatter(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * registerFormatter(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
       registerFormatter("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
       registerFormatter(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
       registerFormatter(name,value=>{...},{langauge:"zh,cht"})

     
     * @param {*} formatter 
        language : 声明该格式化器适用语言
        isGlobal : 注册到全局
     */
    registerFormatter(name,formatter,{language="*"}={}){
        if(!isFunction(formatter) || typeof(name)!=="string"){
            throw new TypeError("Formatter must be a function")
        }                
        language = Array.isArray(language) ? language : (language ? language.split(",") : []);
        language.forEach(lng=>{
            if(DataTypes.includes(name)){
                this.formatters[lng].$types[name] = formatter;
            }else {
                this.formatters[lng][name] = formatter;
            }  
        });
    }
    /**
    * 注册默认文本信息加载器
    */
    registerDefaultLoader(fn){
        if(!isFunction(fn)) throw new Error("The default loader must be a async function or promise returned")
        this._defaultMessageLoader = fn;
        this.refresh();
    } 
    async refresh(){
        try{
            let requests = this._scopes.map(scope=>scope.refresh());
            if(Promise.allSettled){
                await Promise.allSettled(requests);
            }else {
                await Promise.all(requests);
            }
        }catch(e){
            if(this._debug) console.error(`Error while refresh voerkai18n scopes:${e.message}`); 
        }
    }

} 

var runtime ={
    getInterpolatedVars,
    replaceInterpolatedVars,
    I18nManager,
    translate,
    i18nScope,
    createFormatter,
    Formatter,
    getDataTypeName,
    isNumber,
    isNothing,
    isPlainObject,
    isFunction,
    deepMerge,
    deepMixin
};

module.exports = runtime;
//# sourceMappingURL=runtime.cjs.map
