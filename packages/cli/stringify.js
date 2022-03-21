/**
 *  实现将{}转化为字符串
 * 
 *  为什么不使用JSON.stringify?
 *  
 *  假设有这样的翻译内容
 *  {
 *     "保存{}\n": "Save{}\n",
 *  }
 *  这个内容中包含了转义字符\n，JSON.stringify会将\n转义为\\n
 *  因此，在保存后文件中就变成：
 *  {
 *     "保存{}\\n": "Save{}\n",
 *  }
 *  这个转义方式比较不符合我们的预期，更关键的是，在require("cn.js")时，
 *  得到的是：
 *  {
 *     "保存{}\\n": "Save{}\n",
 *  }
 *  这样当我们调用t函数时就会找不到对应在的key
 * 
 *  问题的关键就在于，JSON.stringify对转义字符的处理不能符合我们的要求。
 * 
 *  因此，不得不自己来处理转义字符.
 * 
 *  使用objectToString方法后，就可以确保在翻译文件中的转义字符能按预期的方式工作。
 * 
 * 
 * 
 */

const { isPlainObject } = require("./utils")
/**
 * 
 * JSON.stringify在将一个JSON转化为字符串时会对字符串里面的\t等转义符进行再次转义
 * 导致在使用包含\t等转义符为key时会出现问题
 * 
 * 
 * @param {*} obj 
 * @returns 
 */
 function escape(str){
    return str.replaceAll(/\\\\(?![trnbvf'"]{1})/g,"\\\\")
            .replaceAll("\t","\\t")
            .replaceAll("\n","\\n")
            .replaceAll("\b","\\b")
            .replaceAll("\r","\\r")
            .replaceAll("\f","\\f")
            .replaceAll("\'","\\'")
            .replaceAll('\"','\\"')
            .replaceAll('\v','\\v')       
}
function unescape(str){
    return str
            .replaceAll("\\t","\t")
            .replaceAll("\\n","\n")
            .replaceAll("\\b","\b")
            .replaceAll("\\r","\r")
            .replaceAll("\\f","\f")
            .replaceAll("\\'","\'")
            .replaceAll('\\"','\"')
            .replaceAll('\\v','\v')
            //.replaceAll("\\\\",'\\')       
}


/**
 * 获取字符串的长度，中文算两个字符
 * @param {*} s 
 * @returns 
 */
function getStringWidth(s){
    let str = String(s)
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;  
} 
 
function objectStringify(obj,{indent=4,alignKey=true}={}){
    function nodeToString(node,level,last=false){
        let results = [],beginChar = "",endChar = "" 
        level++
        if(Array.isArray(node)){
            beginChar = "[\n"
            node.forEach((value,index)=>{
                const isLastItem = index ===node.length-1    
                let item = value
                if(Array.isArray(value) || isPlainObject(value)){
                    item = nodeToString(value, level,isLastItem)
                }else if(typeof(value)==="string"){
                    item = `"${escape(value)}"`
                }else if(typeof(value)==="number"){
                    item = value.toString()
                }else if(typeof(value)==="boolean"){
                    item = value.toString()
                }  
                // 如果最后一项     
                if(!isLastItem){
                    item = item+","
                }else{
                    item = item+"\n"
                }
                results.push(item)
            })
            endChar =" ".repeat((level-1) * indent) + "]" 
            return beginChar + results.map(item=>{
                return `${" ".repeat(level * indent)}${item}`
            }).join("\n") + endChar
        }else if(isPlainObject(node)){
            beginChar = "{\n"
            const length = Object.keys(node).length
            const indentSpace = " ".repeat(level * indent)
            let alignIndent = 0
            Object.entries(node).forEach(([key,value],index)=>{
                const isLastItem = index ===length-1    
                alignIndent = Math.max(getStringWidth(escape(key)),alignIndent)
                let item = [`${indentSpace}"${escape(key)}"`,value]
                if(Array.isArray(value) || isPlainObject(value)){
                    item[1] = nodeToString(value, level,isLastItem)
                }else if(typeof(value)==="string"){
                    item[1] = `"${escape(value)}"`
                }else if(typeof(value)==="number"){
                    item[1] = `${value.toString()}`
                }else if(typeof(value)==="boolean"){
                    item[1] = `${value.toString()}`
                }   
                // 如果最后一项     
                if(!isLastItem){
                    item[1] = item[1]+","
                }else{
                    item[1] = item[1]+"\n"
                }
                results.push(item)
            })
            endChar =" ".repeat((level-1) * indent) + "}" 
            return beginChar + results.map(item=>{
                if(alignKey){
                    return `${item[0]}${" ".repeat(alignIndent-getStringWidth(item[0].trim())+2)}: ${item[1]}`
                }else{
                    return `${item[0]}: ${item[1]}`
                }
            }).join("\n") + endChar
       }
      
    }
    return nodeToString(obj,0,true)
} 
module.exports = {
    objectStringify,
    escape,
    escape2,
    unescape
}
 