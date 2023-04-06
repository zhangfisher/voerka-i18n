/**
 * 
 *  保存所有格式化器数据 * 
 * 
 * 
 */
import  { FormatterStore } from './formatterStore';
import type { VoerkaI18nScope } from './scope';
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

export class VoerkaI18nFormatterRegistry extends FormatterStore{
    // 由于语言的格式化器集合允许是一个异步加载块，所以需要一个ready标志
    // 当语言格式化器集合加载完成后，ready标志才会变为true
    #ready:boolean = false
    #language:string = 'zh'
    constructor(scope:VoerkaI18nScope){ 
        super()
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