import { SupportedDateTypes } from '@voerkai18n/runtime/src/types';

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
export function getDataTypeName(v:any):SupportedDateTypes{
	if (v === null)  return 'Null' 
	if (v === undefined) return  'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
};
 