/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type  { VoerkaI18nScope } from "../../scope";
import { VoerkaI18nFormatterManager } from "./manager";





export class FormatterMixin{
    private _formatterManager:VoerkaI18nFormatterManager | null = null
    // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
    get formatters() {	return this._formatterManager! }                   

    protected initFormatters(this:VoerkaI18nScope){
        this._formatterManager = new VoerkaI18nFormatterManager(this)         
    }

    registerFormatter(this:VoerkaI18nScope,name:string, formatter:VoerkaI18nFormatter, options?:{ language?:  string | string[] | "*", asGlobal?:boolean } ) {
        
    }
    

    /**
     * 初始化格式化器
     * 激活和默认语言的格式化器采用静态导入的形式，而没有采用异步块的形式，这是为了确保首次加载时的能马上读取，而不能采用延迟加载方式
     * #activeFormatters={
     *      global:{...} // 或true代表注册到全局
     *      $config:{...},
     *      $types:{...},
     *      [格式化器名称]:()=>{...},
     *      [格式化器名称]:()=>{...},
     *      ...
     * }
     */
    // private _loadInitialFormatters(){          
    //     this._formatterRegistry= new VoerkaI18nFormatterManager(this)
    //     // 初始化格式化器
    //     this.formatters.loadInitials(this._options.formatters)
    //     // 保存到Registry中，就可以从options中删除了
    //     delete (this.options as any).formatters
    // }
        
	/**
     * 注册格式化器
     * 
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatter(name,value=>{...})                                 // 注册到所有语言
     * registerFormatter(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * registerFormatter(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
     * registerFormatter("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
     * registerFormatter(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
     * registerFormatter(name,value=>{...},{langauge:"zh,cht"})       
     * @ param {*} formatter            格式化器
        language : 字符串或数组，声明该格式化器适用语言
           *代表适用于所有语言
           语言名称，语言名称数组，或者使用,分割的语言名称字符串
        asGlobal : 注册到全局
     */
	// registerFormatter(this:VoerkaI18nScope,name:string, formatter:VoerkaI18nFormatter, options?:{ language?:  string | string[] | "*", asGlobal?:boolean } ) {
    //     const {language = "*", asGlobal= true} = options || {} 
	// 	if(asGlobal){
    //         this.global.registerFormatter(name, formatter, {language});
    //     }else{
    //         this.formatters.register(name, formatter, {language});
    //     }
	// }
}
