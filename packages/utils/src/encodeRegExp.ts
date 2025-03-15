import { escapeRegex } from './escapeRegex';
/**
 * 
 * 将一个正则表达式转换为字符串形式
 * 
 * 如果提供了vars参数，将会替换掉正则表达式字符串中的变量
 * 
 * encodeRegExp(/a\bc/i) => "a\\bc"
 * encodeRegExp(/<__TAG__ a\bc/i,{'__TAG__':'div'}) => "<div a\\bc"
 * 
 * 
 * @param regex 
 * @returns 
 */
export function encodeRegExp(regex:RegExp,vars?:Record<string,string>){
    let r = regex.toString().replace(/^\/|\/$/g, "");
    if(vars && typeof(vars)==="object"){
        Object.entries(vars).forEach(([k,v])=>{
            r = r.replaceAll(k,v)
        })        
    }
    return r
}