
/**
 * 移除字符串前后的字符
 * 
 * trimChars(" hello world  ") => "hello world"
 * trimChars(" \nhello world\n ") => "hello world"
 * 
 * @param {*} str 
 * @param {*} chars 
 * @returns 
 */
export function trimChars(str:string,chars=['"',"'"]){
    let start = 0
    let end = str.length
    while(start<end && chars.includes(str[start])){
        start++
    }
    while(end>start && chars.includes(str[end-1])){
        end--
    }
    return str.substring(start,end) 
}
