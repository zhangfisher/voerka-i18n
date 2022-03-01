

// 用来提取字符里面的插值变量参数
// let varRegexp = /\{\s*(?<var>\w*\.?\w*)\s*\}/g
let varRegexp = /\{\s*((?<varname>\w+)?(\s*\|\s*(?<formatter>\w*))?)?\s*\}/g
// 插值变量字符串替换正则
//let varReplaceRegexp =String.raw`\{\s*(?<var>{name}\.?\w*)\s*\}`


let varReplaceRegexp =String.raw`\{\s*{varname}\s*\}`

/**
 * 考虑到通过正则表达式进行插件的替换可能较慢，因此提供一个简单方法来过滤掉那些
 * 不需要进行插值处理的字符串
 * 原理很简单，就是判断一下是否同时具有{、}字符
 * 注意：该方法只能快速判断一个字符串不包括插值变量
 * @param {*} str 
 * @returns {boolean}  true=可能包含插值变量,
 */
function hasInterpolation(str){
    return str.includes("{") && str.includes("}")
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
function getDataTypeName(v){
	if (v === null)  return 'Null' 
	if (v === undefined) return 'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
};

/**
 * 生成一个基于时间戳的文本id
 * performance.now()返回的是当前node进程从启动到现在时间戳
 * 但是连续调用可能会导致重复id的生成，如果发现重复则会
 * 在生成的id后面加上一个随机数，以保证id的唯一性
 */
function getMessageId(){
    this.lastMsgId = null
    let id = String(performance.now()).replace(".","")
    if(this.lastMsgId === id){
        id = id + parseInt(Math.random() * 1000) .toString()   
    }else{
        this.lastMsgId = id
    } 
    return id
}
/**  
 * 提取字符串中的插值变量
 * @param {*} str 
 * @returns {Array} 变量名称列表
 */
function getInterpolatedVars(str){
    let result = []
    let match 
    while ((match = varRegexp.exec(str)) !== null) {
        if (match.index === varRegexp.lastIndex) {
            varRegexp.lastIndex++;
        }          
        if(match.groups.varname) {
            result.push(match.groups.formatter ? match.groups.varname+"|"+match.groups.formatter : match.groups.varname)
        }
    }
    return result
}

function transformVarValue(value){
    let result  = value
    if(typeof(result)==="function") result = value()
    if(!(typeof(result)==="string")){
        if(Array.isArray(result) || typeof(result)==="object"){
            result = JSON.stringify(result)
        }else{
            result = result.toString()
        }
    }
    return result
}
 /**
  * 字符串可以进行变量插值替换，
    - 当只有两个参数并且第2个参数是{}时，将第2个参数视为命名变量的字典
        replaceVars("this is {a}+{b},{a:1,b:2}) --> this is 1+2
    - 当只有两个参数并且第2个参数是[]时，将第2个参数视为位置参数
       replaceVars"this is {}+{}",[1,2]) --> this is 1+2
    - 普通位置参数替换
       replaceVars("this is {a}+{b}",1,2) --> this is 1+2
    - 
   
  * @param {*} template 
  * @returns 
  */
function replaceInterpolateVars(template,...args) {
    let result=template
    if(!hasInterpolation(template)) return 
    if(args.length===1 && typeof(args[0]) === "object" && !Array.isArray(args[0])){  // 变量插值
        for(let name in args[0]){
            // 如果变量中包括|管道符,则需要进行转换以适配更宽松的写法，比如data|time能匹配"data |time","data | time"等
            let nameRegexp = name.includes("|") ? name.split("|").join("\\s*\\|\\s*") : name 
            result=result.replaceAll(new RegExp(varReplaceRegexp.replaceAll("{varname}",nameRegexp),"g"),transformVarValue(args[0][name]))
        }
    }else{ // 位置插值
        const params=(args.length===1 && Array.isArray(args[0])) ?  [...args[0]] : args         
        let i=0
        for(let match of result.match(varRegexp) || []){
            if(i<params.length){
                let param = transformVarValue(params[i])
                result=result.replace(match,param)
                i+=1
            }
        }
    }
    return result
}    




// const str = "I am {name}, I am {age} years old. you are {name},Now is {date},time={date | time}?"

// console.log("vars=",getInterpolatedVars(str).join())

// console.log(replaceInterpolateVars(str,{name:"tom",age:18,date:new Date(),"date|time":new Date().getTime()}))
// console.log(replaceInterpolateVars(str,"tom",18,"jack"))
// console.log(replaceInterpolateVars(str,["tom",18,"jack",1,2]))
// console.log(replaceInterpolateVars(str,"tom",18,()=>"bob"))
// console.log(replaceInterpolateVars(str,"tom",[1,2],{a:1},1,2))

module.exports = {
    getMessageId,
    hasInterpolation,
    getInterpolatedVars,
    replaceInterpolateVars
}


