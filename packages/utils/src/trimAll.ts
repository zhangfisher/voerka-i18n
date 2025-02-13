
/**
 * 移除字符串前后的字符
 * 
 * trimAll(" hello world  ") => "hello world"
 * trimAll(" \nhello world\n ") => "hello world"
 * 
 * @param {*} str 
 * @param {*} chars 
 * @returns 
 */
export function trimAll(str:string,chars=['"',"'"]){
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
