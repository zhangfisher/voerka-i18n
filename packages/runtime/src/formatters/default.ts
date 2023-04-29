import { assignObject } from 'flex-tools/object/assignObject';
import { VoerkaI18nFormatterConfigs } from '../types';
import { toNumber } from "../utils"
import { Formatter } from "../formatter"

/**
  *  字典格式化器
  * 
  *  {value | dict({1:"one",2:"two",3:"three",4:"four"})}

  * @param {*} value 
  * @param  {...any} args 
  * @returns 
  */
export function dict(key:string, values:any)  { 
    if(key in values){
        return values[key]
    }else{
        return ("default" in values) ? values[key] : values
    }
}
 
/**
 * 
 * 空值： null,undefined
 * 
 * 当输入空值时的处理逻辑
 * 
 * { value | empty }  ==  转换显示为'空'或者''，由不同语言的翻译文件定义
 * { value | empty('无') }  == 无
 * { value | empty('0')  | unit('KB')} ==  0KB     
 * 
 * 有时在处理其他类型时，可能希望将0或者''也视为空值 
 * { value | empty('没钱了') } == 
 * 
 * 
 * @param {*} value 
 * @param {String} escapeValue 
 * @param {*} config 
 */
export const empty = Formatter<any,[escapeValue:any]>(function(value:any,[escapeValue],config:VoerkaI18nFormatterConfigs){
    let opts = assignObject({escape:"",values:[]},config)             
    if(escapeValue!=undefined) opts.escape = escapeValue
    let emptyValues = [undefined,null,'']
    if(Array.isArray(opts.values)) emptyValues.push(...opts.values)    
    return emptyValues.includes(value) ? opts.escape : value
},{
    params:["escape"],
    configKey: "empty"
})

/**
 * 添加前缀
 * @param {*} value 
 * @param {*} prefix 
 * @returns 
 */
export function prefix(value:string,[prefix]:[prefix:string]) {
    return prefix ?  `${prefix || ''}${value}` : value
}
/**
 * 添加后缀
 * @param {*} value 
 * @param {*} suffix 
 * @returns 
 */
export function suffix(value:string,[suffix]:[suffix:string]) {
    return suffix ? `${value}${suffix || ''}` : value
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
  ]
const FILE_SIZE_BRIEF_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"] 
const FILE_SIZE_WHOLE_UNITS = ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"]

/**
 * 输出文件大小
 *
 * { value | fileSize }  
 * { value | fileSize('KB') }  
 * { value | fileSize('MB') }  
 * 
 * @param {*} value 
 * @param {*} unit   单位，未指定时采用自动方式，即<1024用字节，1024<v<1024*1024显示KB,...
 * @param {*} brief  是否采用简称单位
 * @param {*} options 
 */
 export const filesize= Formatter<any,[unit:string,brief:boolean]>((value:string,[unit,brief],config:VoerkaI18nFormatterConfigs)=>{
    let v = toNumber(value)
    let unitIndex
    if(unit==undefined || unit=="auto"){
        unitIndex = FILE_SIZE_SECTIONS.findIndex(x=>v<x) - 1
    }else{
        unit = unit.toUpperCase()
        unitIndex =["B","BYTE","BYTES"].includes(unit) ? 0 : FILE_SIZE_BRIEF_UNITS.indexOf(unit)
    }
    if(unitIndex<0 || unitIndex>=FILE_SIZE_BRIEF_UNITS.length) unitIndex= 0
    let result = (unitIndex == 0 ? v : v / FILE_SIZE_SECTIONS[unitIndex]).toFixed(config.precision)
    if( unitIndex>0 && (v % FILE_SIZE_SECTIONS[unitIndex])!==0) result = result+"+" 
    // 去除尾部的0
    while(["0","."].includes(result[result.length-1])){
        result = result.substring(0, result.length-2) 
    } 
    return  brief ? `${result} ${config.brief[unitIndex]}` : `${result} ${config.whole[unitIndex]}`
},{
    params:["unit","brief"],
    configKey:"fileSize"
})

 