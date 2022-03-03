 
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
 * 支持导入cjs和esm模块
 * @param {*} url 
 */
async function importModule(url){
    try{
        return require(url)
    }catch(e){
        // 当加载出错时，尝试加载esm模块
        if(e.code === "MODULE_NOT_FOUND"){
            return await import(url) 
        }else{
            throw e
        }
    } 
}



module.exports = {
    getDataTypeName,
    isNumber,
    isPlainObject,
    importModule
}


