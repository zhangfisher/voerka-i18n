// type InterpolatedVarReplacer = (varname:string,formatters:FormatterDefineChain,matched:string)=>string;
// [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
const interpVarRegexp =	/\{\s*.*?\s*\}/g;

/**
 * 
 * @param {String} str 
 */
function hasInterpolation(str) {
	return str.includes("{") && str.includes("}");
}


/**
 * 遍历str中的所有插值变量传递给callback，将callback返回的结果替换到str中对应的位置
 * @param {*} str
 * @param {Function(<变量名称>,[formatters],match[0])} callback
 * @param {Boolean} replaceAll   是否替换所有插值变量，当使用命名插值时应置为true，当使用位置插值时应置为false
 * @returns  返回替换后的字符串
 */
function forEachInterpVars(str, replacer, options = {}) {
	let result = str, matched;
	let opts = Object.assign({replaceAll: true },options);
	interpVarRegexp.lastIndex = 0;
    let index = 0;
    
	while ((matched = interpVarRegexp.exec(result)) !== null) {
        // 这对于避免零宽度匹配的无限循环是必要的
        if (matched.index === interpVarRegexp.lastIndex) {
            interpVarRegexp.lastIndex++;
        }        
        
		interpVarRegexp.lastIndex = 0;
	}
	return result;
}
