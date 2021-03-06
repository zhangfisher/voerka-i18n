
/**
 * 判断是否是JSON对象
 * @param {*} obj 
 * @returns 
 */
 function isPlainObject(obj){
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    var baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto; 
}

function isNumber(value){
    return !isNaN(parseInt(value))
}
 
/**
 * 简单进行对象合并
 * 
 * options={
 *    array:0 ,        // 数组合并策略，0-替换，1-合并，2-去重合并
 * }
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @returns 合并后的对象
 */
function deepMerge(toObj,formObj,options={}){
    let results = Object.assign({},toObj)
    Object.entries(formObj).forEach(([key,value])=>{
        if(key in results){
            if(typeof value === "object" && value !== null){
                if(Array.isArray(value)){
                    if(options.array === 0){
                        results[key] = value
                    }else if(options.array === 1){
                        results[key] = [...results[key],...value]
                    }else if(options.array === 2){
                        results[key] = [...new Set([...results[key],...value])]
                    }
                }else{
                    results[key] = deepMerge(results[key],value,options)
                }
            }else{
                results[key] = value
            }
        }else{
            results[key] = value
        }
    })
    return results
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





module.exports ={
    isPlainObject,
    isNumber,
    deepMerge,
    getDataTypeName
}