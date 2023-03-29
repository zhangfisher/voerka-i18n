/**
 * 
 * 解析格式化器
 * 
 * 解析{ varname | formater(...params) }中的params部分
 * 
 * 
 * 
 */


const { getByPath,isNumber,isFunction,isPlainObject,escapeRegexpStr,safeParseJson } = require("./utils")

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
function parseFormatters(formatters) {
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
        tags.push(["{","}"])
        tags.push(["[","]"])
    }
    const tagsRegexs = tags.map(([beginTag,endTag])=>{
        return `(${escapeRegexpStr(beginTag)}1%.*?%1${escapeRegexpStr(endTag)})`
    })
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
     let i = 0
     let flagIndex = 0 
     while(i<str.length){
         let beginChars = str.slice(i,i+beginTag.length)
         let endChars = str.slice(i,i+endTag.length)        
         if(beginChars==beginTag){
             flagIndex++
             str = str.substring(0,i+beginTag.length) + `${flagIndex}%` + str.substring(i+beginTag.length)             
             i+=beginTag.length + String(flagIndex).length+1
             continue
         }
         if(endChars==endTag){
             if(flagIndex>0){
                 str = str.substring(0,i) + `%${flagIndex}` + str.substring(i) 
             }            
             i+= endTag.length + String(flagIndex).length +1 
             flagIndex--
             continue
         }
         i++        
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
         tags.push(["{","}"])
         tags.push(["[","]"])
     }
     tags.forEach(tag=>{
         if(str.includes(tag[0]) && str.includes(tag[1])){
             str = addTagFlags(str,...tag)
         }
     })
     return str
 }
 
 function removeTagFlags(str,beginTag,endTag){
     const regexs = [
         [beginTag,new RegExp(escapeRegexpStr(beginTag)+"\\d+%")],
         [endTag,new RegExp("%\\d+"+escapeRegexpStr(endTag))]
     ]
    regexs.forEach(([tag,regex])=>{
        let matched
        while ((matched = regex.exec(str)) !== null) {
            if (matched.index === regex.lastIndex) regex.lastIndex++;            
            str = str.replace(regex,tag)
        }
    })
     return str    
 }
 
 function removeTagHelperFlags(str,...tags){
     if(tags.length==0){
         tags.push(["{","}"])
         tags.push(["[","]"])
     }
     tags.forEach(([beginTag,endTag])=>{
         if(str.includes(beginTag) && str.includes(endTag)){
             str = removeTagFlags(str,beginTag,endTag)
         }        
     })
     return str
 }

// 提取匹配("a",1,2,'b',{..},[...]),不足：当{}嵌套时无法有效匹配
//  const formatterParamsRegex = /((([\'\"])(.*?)\3)|(\{.*?\})|(\[.*?\])|([\d]+\.?[\d]?)|((true|false|null)(?=[,\b\s]))|([\w\.]+)|((?<=,)\s*(?=,)))(?<=\s*[,\)]?\s*)/g;
 
// 支持解析嵌套的{}和[]参数， 前提是：字符串需要经addTagHelperFlags操作后，会在{}[]等位置添加辅助字符
// 解析嵌套的{}和[]参数基本原理：在{}[]等位置添加辅助字符，然后使用正则表达式匹配，匹配到的字符串中包含辅助字符，然后再去除辅助字符
const formatterNestingParamsRegex = String.raw`((([\'\"])(.*?)\3))|__TAG_REGEXP__([\d]+\.?[\d]?)|((true|false|null)(?=[,\b\s]))|([\w\.]+)|((?<=,)\s*(?=,))(?<=\s*[,\)]?\s*)`
  
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
    strParams = addTagHelperFlags(strParams) 
    try{
        let regex =new RegExp(getNestingParamsRegex(),"g")
        while ((matched = regex.exec(strParams)) !== null) {
            // 这对于避免零宽度匹配的无限循环是必要的
            if (matched.index === regex.lastIndex) {
                regex.lastIndex++;
            }        
            let value = matched[0]
            if(value.trim()==''){
                value = null
            }else if((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))){
                value = value.substring(1,value.length-1)
                value = removeTagHelperFlags(value)
            }else if((value.startsWith("{") && value.endsWith("}")) || (value.startsWith('[') && value.endsWith(']'))){
                try{
                    value = removeTagHelperFlags(value)
                    value = safeParseJson(value)
                }catch{}
            }else if(["true","false","null"].includes(value)){
                value = JSON.parse(value)
            }else if(isNumber(value)){
                value = parseFloat(value)
            }else{ 
                value = removeTagHelperFlags(String(value))
            }
            params.push(value) 
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
 function createFormatter(fn,options={},defaultParams={}){
    let opts = Object.assign({
        normalize    : null,         // 对输入值进行规范化处理，如进行时间格式化时，为了提高更好的兼容性，支持数字时间戳/字符串/Date等，需要对输入值进行处理，如强制类型转换等
        params       : null,         // 可选的，声明参数顺序，如果是变参的，则需要传入null
        configKey    : null          // 声明该格式化器在$config中的路径，支持简单的使用.的路径语法
    },options)     

    // 最后一个参数是传入activeFormatterConfig参数
    // 并且格式化器的this指向的是activeFormatterConfig
    const $formatter =  function(value,...args){
        let finalValue = value
        // 1. 输入值规范处理，主要是进行类型转换，确保输入的数据类型及相关格式的正确性，提高数据容错性
        if(isFunction(opts.normalize)){
            try{
                finalValue = opts.normalize(finalValue)
            }catch{}
        }
        // 2. 读取activeFormatterConfig
        let activeFormatterConfigs = args.length>0 ? args[args.length-1] : {}
        if(!isPlainObject( activeFormatterConfigs))  activeFormatterConfigs ={}   
        // 3. 从当前语言的激活语言中读取配置参数
        const formatterConfig =Object.assign({},defaultParams,getByPath(activeFormatterConfigs,opts.configKey,{}))
        let finalArgs
        if(opts.params==null){// 如果格式化器支持变参，则需要指定params=null
            finalArgs = args.slice(0,args.length-1)
        }else{  // 具有固定的参数个数
            finalArgs = opts.params.map(param=>{
                let paramValue = getByPath(formatterConfig,param,undefined)   
                return isFunction(paramValue) ? paramValue(finalValue) : paramValue
            })
            // 4. 将翻译函数执行格式化器时传入的参数覆盖默认参数     
            for(let i =0; i<finalArgs.length;i++){
                if(i==args.length-1) break // 最后一参数是配置
                if(args[i]!==undefined) finalArgs[i] = args[i]
            }
        }        
        return fn.call(this,finalValue,...finalArgs,formatterConfig)
    }
    $formatter.configurable = true     
    return $formatter
}

const Formatter = createFormatter



/**
 * 创建支持弹性参数的格式化器
 * 弹性参数指的是该格式式化器支持两种传参数形式:
 * - 位置参数： { value | format(a,b,c,d,e) }
 * - 对象参数： { value | format({a,b,c,e}) }
 * 
 *  弹性参数的目的是只需要位置参数中的第N参数时，简化传参
 *  例： 
 *  上例中，我们只需要传入e参数，则不得不使用{ value | format(,,,,e) }
 *  弹性参数允许使用 { value | format({e:<value>}) }       
 *  
 *  请参阅currencyFormatter用法
 *  
 * @param {*} fn 
 * @param {*} options 
 * @param {*} defaultParams 
 */
const createFlexFormatter = function(fn,options={},defaultParams={}){
    const $flexFormatter =  Formatter(function(value,...args){
        // 1. 最后一个参数是格式化器的参数,不同语言不一样
        let $config = args[args.length-1]
        // 2. 从语言配置中读取默认参数
        let finalParams = options.params.reduce((r,name) =>{
            r[name] = $config[name]==undefined ? defaultParams[name] : $config[name]
            return r
        } ,{})
        // 3. 从格式化器中传入的参数具有最高优先级，覆盖默认参数
        if(args.length==2 && isPlainObject(args[0])){       // 一个参数且是{}
            Object.assign(finalParams,{format:"custom"},args[0])
        }else{   // 位置参数,如果是空则代表
            for(let i=0; i<args.length-1; i++){
                if(args[i]!==undefined) finalParams[options.params[i]] = args[i]
            }
        }   
        return fn.call(this,value,finalParams,$config)
    },{...options,params:null})  // 变参工式化器需要指定params=null
    return $flexFormatter 
}



const FlexFormatter = createFlexFormatter

module.exports = {
    createFormatter,
    createFlexFormatter,
    Formatter,
    FlexFormatter,
    parseFormatters
    
}