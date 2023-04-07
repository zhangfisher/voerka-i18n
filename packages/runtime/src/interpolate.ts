/**
 *
 * 处理翻译文本中的插件变量
 *
 * 处理逻辑如下：
 *
 *   以"Now is { value | date | prefix('a') | suffix('b')}"为例：
 *
 *  1. 先判断一下输入是否包括{的}字符，如果是则说明可能存在插值变量，如果没有则说明一定不存在插值变量。
 *    这样做的目的是如果确认不存在插值变量时，就不需要后续的正则表表达式匹配提取过程。
 *    这对大部份没有采用插件变量的文本能提高性能。
 *  2. forEachInterpolatedVars采用varWithPipeRegexp正则表达式，先将文本提取出<变量名称>和<格式化器部分>，
 *    即:
 *      变量名称="value"
 *      formatters = "date | prefix('a') | suffix('b')"
 *   3. 将"formatters"使用|转换为数组 ["date","prefix('a')","suffix('b')"]
 *   4. parseFormatters依次对每一个格式化器进行遍历解析为：
 *        [
 *          ["date",[]],
 *          ["prefix",['a']],
 *          ["suffix",['b']]
 *       ]
 *   5. 然后wrapperFormatters从scope中读取对应的格式化器定义,将之转化为
 *      [(value,config)=>{....},(value,config)=>{....},(value,config)=>{....}]
 *      为优化性能，在从格式化器名称转换为函数过程中会进行缓存
 *   6. 最后只需要依次执行这些格式化化器函数即可
 *
 *
 */

import { getDataTypeName } from "./utils"
import { isNumber } from "flex-tools/typecheck/isNumber"
import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { isFunction } from "flex-tools/typecheck/isFunction"
import { FormatterDefineChain, parseFormatters } from "./formatter"
import { VoerkaI18nScope } from "./scope"
import { SupportedDateTypes, VoerkaI18nFormatter, VoerkaI18nFormatterConfigs } from './types';

// 用来提取字符里面的插值变量参数 , 支持管道符 { var | formatter | formatter }
// 支持参数： { var | formatter(x,x,..) | formatter }
// v1 采用命名捕获组
//let varWithPipeRegexp =	/\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w*(\(.*\)){0,1}\s*)*)\s*\}/g;
// v2: 由于一些js引擎(如react-native Hermes )不支持命名捕获组而导致运行时不能使用，所以此处移除命名捕获组
const varWithPipeRegexp =	/\{\s*(\w+)?((\s*\|\s*\w*(\(.*\)){0,1}\s*)*)\s*\}/g;

/**
 * 考虑到通过正则表达式进行插值的替换可能较慢
 * 因此提供一个简单方法来过滤掉那些不需要进行插值处理的字符串
 * 原理很简单，就是判断一下是否同时具有{和}字符，如果有则认为可能有插值变量，如果没有则一定没有插件变量，则就不需要进行正则匹配
 * 从而可以减少不要的正则匹配
 * 注意：该方法只能快速判断一个字符串不包括插值变量
 * @param {*} str
 * @returns {boolean}  true=可能包含插值变量
 */
function hasInterpolation(str:string):boolean {
	return str.includes("{") && str.includes("}");
}



export type InterpolatedVarReplacer = (varname:string,formatters:FormatterDefineChain,matched:string)=>string;
// [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
export type VarFormatters = [string,[string,any[]]];

/**
 * 遍历str中的所有插值变量传递给callback，将callback返回的结果替换到str中对应的位置
 * @param {*} str
 * @param {Function(<变量名称>,[formatters],match[0])} callback
 * @param {Boolean} replaceAll   是否替换所有插值变量，当使用命名插值时应置为true，当使用位置插值时应置为false
 * @returns  返回替换后的字符串
 */
function forEachInterpolatedVars(str:string, replacer:InterpolatedVarReplacer, options = {}) {
	let result = str, matched;
	let opts = Object.assign({replaceAll: true },options);
	varWithPipeRegexp.lastIndex = 0;
	while ((matched = varWithPipeRegexp.exec(result)) !== null) {
        // 这对于避免零宽度匹配的无限循环是必要的
        if (matched.index === varWithPipeRegexp.lastIndex) {
            varWithPipeRegexp.lastIndex++;
        }        
        const varname = matched[1] || "";
		// 解析格式化器和参数 = [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
		const formatters = parseFormatters(matched[2] || "");
		if (isFunction(replacer)) {
			try {
				const finalValue = replacer(varname, formatters, matched[0]);
				if (opts.replaceAll) {
					result = (result as any).replaceAll(matched[0], finalValue);
				} else {
					result = result.replace(matched[0], finalValue);
				}
			} catch {				
				break;// callback函数可能会抛出异常，如果抛出异常，则中断匹配过程
			}
		}
		varWithPipeRegexp.lastIndex = 0;
	}
	return result;
}

 
 
export type FormatterChecker = ((value:any,config?:VoerkaI18nFormatterConfigs)=>any) & {
    $name:string
}  

/**
 * Checker是一种特殊的格式化器，会在特定的时间执行
 *
 * Checker应该返回{value,next}用来决定如何执行下一个格式化器函数
 *
 *
 * @param {*} checker
 * @param {*} value
 * @returns
 */
function executeChecker(checker:FormatterChecker, value:any,scope:VoerkaI18nScope) {
	let result = { value, next: "skip" };
	if (!isFunction(checker)) return result;
	try {
		const r = checker(value,scope.activeFormatterConfig);
		if (isPlainObject(r) && ("next" in r)  &&  ("value" in r)) {
			Object.assign(result, r);
		} else {
			result.value = r;
		}
		if (!["break", "skip"].includes(result.next)) result.next = "break";
	} catch (e:any) {
        if(scope.debug) console.error("Error while  execute VoerkaI18n checker :"+e.message)
    }
	return result;
}
/**
 * 执行格式化器并返回结果
 *
 * 格式化器this指向当前scope，并且最后一个参数是当前scope格式化器的$config
 *
 * 这样格式化器可以读取$config
 *
 * @param {*} value
 * @param {FormatterDefineChain} formatters  经过解析过的格式化器参数链 ，多个格式化器函数(经过包装过的)顺序执行，前一个输出作为下一个格式化器的输入
 *  formatters [ [<格式化器名称>,[<参数>,<参数>,...],[<格式化器名称>,[<参数>,<参数>,...]],...]
 */
function executeFormatter(value:any, formatters:VoerkaI18nFormatter[], scope:VoerkaI18nScope, template:string) {
	if (formatters.length === 0) return value;
	let result = value;
	// 1. 空值检查
	const emptyCheckerIndex:number = formatters.findIndex((func) => (func as any).$name === "empty") 
	if (emptyCheckerIndex != -1) {
		const emptyChecker = formatters.splice(emptyCheckerIndex, 1)[0] as unknown as FormatterChecker
		const { value, next } = executeChecker(emptyChecker, result,scope);
		if (next == "break") {
			return value;
		} else {
			result = value;
		}
	}
	// 2. 错误检查
	const errorCheckerIndex = formatters.findIndex((func) => (func as any).$name === "error"	);
	let errorChecker:FormatterChecker;
	if (errorCheckerIndex != -1) {
		errorChecker = formatters.splice(errorCheckerIndex, 1)[0] as unknown as FormatterChecker
		if (result instanceof Error) {
			(result as any).formatter = errorChecker.$name;
			const { value, next } = executeChecker(errorChecker, result,scope);
			if (next == "break") {
				return value;
			} else {
				result = value;
			}
		}
	}

	// 3. 分别执行格式化器函数
	for (let formatter of formatters) {
		try {
            result = formatter(result, [result],scope.activeFormatterConfig);		
		} catch (e:any) {
			e.formatter = (formatter as any).$name;
			if (scope.debug)
				console.error(`Error while execute i18n formatter<${(formatter as any).$name}> for ${template}: ${e.message} `);
			if (isFunction(errorChecker!)) {
				const { value, next } = executeChecker(errorChecker!, result,scope);
				if (next == "break") {
					if (value !== undefined) result = value;
					break;
				} else if (next == "skip") {
					continue;
				}
			}
		}
	}
	return result;
}

/**
 * 添加默认的empty和error格式化器，用来提供默认的空值和错误处理逻辑
 *
 * empty和error格式化器有且只能有一个，其他无效
 *
 * @param {*} formatters
 */
function addDefaultFormatters(formatters:FormatterDefineChain) {
	// 默认的空值处理逻辑： 转换为"",然后继续执行接下来的逻辑
	if (formatters.findIndex(([name]) => name == "empty") === -1) {
		formatters.push(["empty", []]);
	}
	// 默认的错误处理逻辑:  开启DEBUG时会显示ERROR:message；关闭DEBUG时会保持最近值不变然后中止后续执行
	if (formatters.findIndex(([name]) => name == "error") === -1) {
		formatters.push(["error", []]);
	}
}

/**
 *
 *  经parseFormatters解析t('{}')中的插值表达式中的格式化器后会得到
 *  [[<格式化器名称>,[参数,参数,...]]，[<格式化器名称>,[参数,参数,...]]]数组
 *
 *  本函数将之传换为转化为调用函数链，形式如下：
 *  [(v)=>{...},(v)=>{...},(v)=>{...}]
 *
 *  并且会自动将当前激活语言的格式化器配置作为最后一个参数配置传入,这样格式化器函数就可以读取其配置参数
 *
 * @param {*} scope
 * @param {*} activeLanguage
 * @param {*} formatters
 * @returns {Array}   [(v)=>{...},(v)=>{...},(v)=>{...}]
 *
 */
function wrapperFormatters(scope:VoerkaI18nScope, activeLanguage:string, formatters:FormatterDefineChain) {
	let wrappedFormatters:VoerkaI18nFormatter[] = [];
	addDefaultFormatters(formatters);
	for (let [name, args] of formatters) {
		let fn = scope.formatters.get(name,{on:'scope'}) 
		let formatter;		
		if (isFunction(fn)) {
			formatter = (value:any, args?:any[],config?:VoerkaI18nFormatterConfigs) =>fn.call(scope.activeFormatterConfig, value, args, config);
		} else {
            // 格式化器无效或者没有定义时，查看当前值是否具有同名的原型方法，如果有则执行调用
		    // 比如padStart格式化器是String的原型方法，不需要配置就可以直接作为格式化器调用
			formatter = (value:any) => {
				if (isFunction(value[name])) {
					return value[name](...args);
				} else {
					return value;
				}
			};
		}
        // 为格式化器函数添加一个$name属性，用来标识当前格式化器的名称
		(formatter as any).$name = name;
		wrappedFormatters.push(formatter);
	}
	return wrappedFormatters;
}

/**
 *  将value经过格式化器处理后返回的结果
 * @param {*} scope
 * @param {*} activeLanguage
 * @param {*} formatters     
 * @param {*} value
 * @returns
 */
function getFormattedValue(scope:VoerkaI18nScope, activeLanguage:string, formatters:FormatterDefineChain, value:any, template:string) {
	// 1. 取得格式化器函数列表，然后经过包装以传入当前格式化器的配置参数
	const formatterFuncs = wrapperFormatters(scope, activeLanguage, formatters);
	// 3. 执行格式化器
	// EMPTY和ERROR是默认两个格式化器，如果只有两个则说明在t(...)中没有指定格式化器
	if (formatterFuncs.length == 2) {
		// 当没有格式化器时，查询是否指定了默认数据类型的格式化器，如果有则执行
		const defaultFormatter = scope.formatters.get(getDataTypeName(value),{on:'types'}) 
		if (defaultFormatter) {
			return executeFormatter(value, [defaultFormatter], scope, template);
		}
	} else {
		value = executeFormatter(value, formatterFuncs, scope, template);
	}
	return value;
}

/**
  * 字符串可以进行变量插值替换，
  *    replaceInterpolatedVars("<模板字符串>",{变量名称:变量值,变量名称:变量值,...})
  *    replaceInterpolatedVars("<模板字符串>",[变量值,变量值,...])
  *    replaceInterpolatedVars("<模板字符串>",变量值,变量值,...])
  * 
 - 当只有两个参数并且第2个参数是{}时，将第2个参数视为命名变量的字典
     replaceInterpolatedVars("this is {a}+{b},{a:1,b:2}) --> this is 1+2
 - 当只有两个参数并且第2个参数是[]时，将第2个参数视为位置参数
     replaceInterpolatedVars"this is {}+{}",[1,2]) --> this is 1+2
 - 普通位置参数替换
     replaceInterpolatedVars("this is {a}+{b}",1,2) --> this is 1+2
 - 
 this == scope == { formatters: {}, ... }
 * @param {*} template 
 * @returns 
 */
export function replaceInterpolatedVars(this:VoerkaI18nScope,template:string, ...args:any[]) {
	const scope = this;
	// 当前激活语言
	const activeLanguage = scope.global.activeLanguage;
	// 没有变量插值则的返回原字符串
	if (args.length === 0 || !hasInterpolation(template)) return template;

	// ****************************变量插值****************************
	if (args.length === 1 && isPlainObject(args[0])) {
		// 读取模板字符串中的插值变量列表
		// [[var1,[formatter,formatter,...],match],[var2,[formatter,formatter,...],match],...}
		let varValues = args[0];
		return forEachInterpolatedVars(template,(varname:string, formatters, match) => {
				let value = varname in varValues ? varValues[varname] : "";
				return getFormattedValue(scope,activeLanguage,formatters,value,template);
			}
		);
	} else {
		// ****************************位置插值****************************
		// 如果只有一个Array参数，则认为是位置变量列表，进行展开
		const params =args.length === 1 && Array.isArray(args[0]) ? [...args[0]] : args;
		if (params.length === 0) return template; // 没有变量则不需要进行插值处理，返回原字符串
		let i = 0;
		return forEachInterpolatedVars(template,(varname:string, formatters, match) => {
				if (params.length > i) {
					return getFormattedValue(scope,activeLanguage,formatters,params[i++],template);
				} else {
					throw new Error(); // 抛出异常，停止插值处理
				}
			},
			{ replaceAll: false }
		);
	} 
} 




// /**
//  *  解析格式化器的参数
//  *
// /**  
//   * 提取字符串中的插值变量
//   *  [
//      //   {  
//          name:<变量名称>,formatters:[{name:<格式化器名称>,args:[<参数>,<参数>,....]]｝],<匹配字符串>],
//      //   ....
//      // 
//   * @param {*} str 
//   * @param {*} isFull   =true 保留所有插值变量 =false 进行去重
//   * @returns {Array} 
//   * [
//   *  {
//   *      name:"<变量名称>",
//   *      formatters:[
//   *          {name:"<格式化器名称>",args:[<参数>,<参数>,....]},
//   *          {name:"<格式化器名称>",args:[<参数>,<参数>,....]},
//   *      ],
//   *      match:"<匹配字符串>"
//   *  },
//   *  ...
//   * ]
//   */
//      function getInterpolatedVars(str:string) {
//         let vars = [];
//         forEachInterpolatedVars(str, (varName, formatters, match) => {
//             let varItem = {
//                 name: varName,
//                 formatters: formatters.map(([formatter, args]) => {
//                     return {name: formatter,args: args	};
//                 }),
//                 match: match,
//             };
//             if (vars.findIndex((varDef) =>varDef.name === varItem.name &&	varItem.formatters.toString() ==varDef.formatters.toString()) === -1){
//                 vars.push(varItem);
//             }
//             return "";
//         });
//         return vars;
//     }