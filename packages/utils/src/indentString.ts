
/**
 * 为多行字符串移除空格缩进，如果中tab按4个空格计算
 * @param str 
 * @param indent 
 */
export function indentString(str:string,indent:number = 0){    
    const indentChars = " ".repeat(indent)
    const lines = str.split("\n").map((line)=>{
        if(line.startsWith(indentChars)){
            line = line.substring(indentChars.length)
        }
        return line
    })
    return lines.join("\n")
}
 