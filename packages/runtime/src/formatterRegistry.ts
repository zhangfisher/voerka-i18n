/**
 * 
 *  保存所有格式化器数据 * 
 * 
 * 
 */
import { VoerkaI18nFormatter, VoerkaI18nFormatters, VoerkaI18nFormattersLoader, VoerkaI18nLanguageFormatters, SupportedDateTypes, VoerkaI18nFormatterConfigs  } from './types';
import { DataTypes } from './utils';
import { get as getByPath } from "flex-tools/object/get" 
import { isFunction } from 'flex-tools/typecheck/isFunction';
 

export interface VoerkaI18nScopeCache{
    activeLanguage :string | null,
    typedFormatters: VoerkaI18nLanguageFormatters,
    formatters     : VoerkaI18nLanguageFormatters,
}

export class FormattersNotLoadedError extends Error{
    constructor(language:string){
        super(`Formatters of language<${language}> is not loaded,try to call load()`)
    }
}
const EmptyFormatters:any = {
    $config:{},
    $types:{}
}

export class VoerkaI18nFormatterRegistry{
    // 由于语言的格式化器集合允许是一个异步加载块，所以需要一个ready标志
    // 当语言格式化器集合加载完成后，ready标志才会变为true
    #ready:boolean = false
    #formatters:VoerkaI18nLanguageFormatters = {}
    #language:string = 'zh'
    constructor(){ 
        
    }
    /**
     * 当前语言
     */
    get language(){ return this.#language  }
    set language(language:string){
        this.#language = language        
        if(!(language in this.formatters)){
            (this.#formatters[language] as any) = Object.assign({},EmptyFormatters)
        }
        this.#ready = typeof(this.#formatters[language]) != 'function'
    }    
    
    /**
     * 注册格式化器
      
     格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
      
    register(name,value=>{...})                                 // 注册到所有语言
    register(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
    register(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
    register("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
    register(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
    register(name,value=>{...},{langauge:"zh,cht"})
    @param {*} formatter            格式化器
    @param language : 字符串或数组，声明该格式化器适用语言

        *代表适用于所有语言
        语言名称，语言名称数组，或者使用,分割的语言名称字符串
    */
	register(name:string | SupportedDateTypes, formatter:VoerkaI18nFormatter, {language = "*"}:{ language:  string | string[] } ) {
        if (!isFunction(formatter) || typeof name !== "string") {
			throw new TypeError("Formatter must be a function");
		}
		const languages = Array.isArray(language) ? language: language	? language.split(","): [];
        languages.forEach((lngName:string) => {             
            if(!(lngName in this.#formatters))  this.#formatters[lngName] = {}
            if(typeof(this.#formatters[lngName])!="function"){
                let lngFormatters = this.#formatters[lngName] as any
                if (DataTypes.includes(name)) {                    
                    if(!lngFormatters.$types) lngFormatters.$types = {}
                    lngFormatters.$types![name] = formatter                    
                } else {
                    lngFormatters[name] = formatter;
                }
            }                
        });
	} 
    registerLanguageFormatters(language:string,formatters:VoerkaI18nFormatters | VoerkaI18nFormattersLoader){
        this.#formatters[language] = formatters
    }
    /**
     * 加载所有格式化器
     * @param formatters 
     */
    loadInitials(formatters:VoerkaI18nLanguageFormatters){
        this.#formatters=formatters
    }
    /**
     * 获取指定语言的格式化器配置
     * @param language 
     */
    getConfig(language?:string){
        return language ? getByPath(this.#formatters,`${language}.$config`,{defaultValue:{}}) : {}                
    }
    /**
     获取指定语言中为每个数据类型指定的格式化器
     */
    getTypes(language?:string){
        return language ? getByPath(this.#formatters,`${language}.$types`,{defaultValue:{}}) : {}                
    }
    /**
     获取指定语言中为每个数据类型指定的格式化器
     */
    getFormatters(language?:string){
        return language ? getByPath(this.#formatters,language,{defaultValue:{}}) : {}                
    }
    /**
     * 更新指定语言的格式化器配置参数
     * @param language 
     * @param config 
     */
    updateConfig(language:string,config:VoerkaI18nFormatterConfigs){
        if(language in this.#formatters){
            const formatters = this.#formatters[language]
            if(typeof(formatters)=='function'){
                throw new FormattersNotLoadedError(language)
            }else{ 
                if(!formatters.$config){
                    formatters.$config = {}
                }
                Object.assign(formatters.$config,config)
            }
        }        
    }
    /**
     * 返回指定语言是否具有格式化器集合
     * @param language 
     */
    hasLanguage(language:string){
        return language in this.#formatters
    }

    //****************** 以下方法和属性只作用于当前语言 *********************** */
    
    /**
    * 当格式化器是一个()=>import(...)或一个返回格式化器集合的Promise时，需要调用load()方法加载格式化器
    * 
    * 这是由于不同语言的格式化器允许声明为异步加载块，因此需要在切换语言使用时才加载
    * 
    */
    async load(){
        let loader = this.#formatters[this.#language] as VoerkaI18nFormattersLoader
        if(typeof(loader) === 'function'){
            this.#formatters[this.#language] = await loader()
            this.#ready = true      
        }// 如果是一个对象，则直接返回，不需要调用
    }
    /**
     * 当前语言的格式化器集合
     */
    get formatters(){
        if(!this.#ready) throw new FormattersNotLoadedError(this.#language)
        return this.#formatters[this.#language] as VoerkaI18nFormatters
    } 
    /**
     * 返回当前语言的格式化器
     * @param name 格式化名称
     */
    get(name:string,dataType?:SupportedDateTypes):VoerkaI18nFormatter | undefined{
        if(!this.#ready) throw new FormattersNotLoadedError(this.#language)
        const lngFormatters = this.#formatters[this.#language] as any
        if(dataType && (dataType in lngFormatters.$types!)){
            return lngFormatters.$types![dataType]
        }else if(name in lngFormatters){
            return lngFormatters[name]
        }
    }
    /**
     * 当前语言的格式化器配置
     */
    get config(){
        if(!this.#ready) throw new FormattersNotLoadedError(this.#language)
        return (this.#formatters[this.#language] as VoerkaI18nFormatters).$config as VoerkaI18nFormatterConfigs
    }
    get types(){
        if(!this.#ready) throw new FormattersNotLoadedError(this.#language)
        return (this.#formatters[this.#language] as VoerkaI18nFormatters).$types as VoerkaI18nFormatterConfigs
    }

}