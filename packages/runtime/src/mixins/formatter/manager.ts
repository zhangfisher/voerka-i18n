/**
 * 
 *  保存所有格式化器数据
 * 
 * 
 */
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import type { VoerkaI18nScope } from '../../scope';
import { get as getByPath } from "flex-tools/object/get" 
import { isFunction } from 'flex-tools/typecheck/isFunction';
import { deepMerge } from 'flex-tools/object/deepMerge';
import { assignObject } from 'flex-tools/object/assignObject';
import {  SupportedDateTypes,  } from '../../types'; 
import { deepClone } from 'flex-tools/object/deepClone';         
import { VoerkaI18nFormatterBuilder, VoerkaI18nFormatters } from './types';

export interface VoerkaI18nScopeCache{
    activeLanguage :string | null,
    typedFormatters: VoerkaI18nFormatters,
    formatters     : VoerkaI18nFormatters,
}

export class FormattersNotLoadedError extends Error{
    constructor(language:string){
        super(`Formatters of language<${language}> is not loaded,try to call load()`)
    }
}
 

export class VoerkaI18nFormatterManager{
    private _formatters        : VoerkaI18nFormatters = {}  
    private _scope             : VoerkaI18nScope
    private _language?         : string                                               
    private _cache             : VoerkaI18nScopeFormatterCache = { typedFormatters:{}, formatters:{}}
    
    constructor(scope:VoerkaI18nScope){ 
        this._scope = scope   
        this._formatters = scope?.options.formatters     
    }    

    get scope(){ return this._scope! }     
    get cache(){ return this._cache } 

    private _clearCache(){
        this._cache = {typedFormatters:{},formatters:{}}
    }

    private _init(){
        Object.entries(this._formatters).forEach(([name,formatterBuilder])=>{
            if(name==='$config') return
            const builder = formatterBuilder as VoerkaI18nFormatterBuilder
            const filter = builder(this.scope)            
            try{
                this.scope.interpolator.addFilter(filter)
                if(filter.global){
                    this.scope.manager
                }
            }catch(e:any){
                this.scope.logger.error(`注册格式化器<${name}>失败：${e.stack}`)
            }
        })        
    }




    /**
     * 注册全局格式化器
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatter(name,value=>{...})                                 // 注册到所有语言
     * registerFormatter(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * registerFormatter(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
       registerFormatter("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
       registerFormatter(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
       registerFormatter(name,value=>{...},{langauge:"zh,cht"})

     
     * @param {*} formatter 
        language : 声明该格式化器适用语言
     */
    registerFormatter(name:string,formatter:VoerkaI18nFormatter,options?:{language?:string | string[] | '*'}){
        const {language = "*"} = options || {}
        if (!isFunction(formatter) || typeof name !== "string") {
            throw new TypeError("格式化器必须是一个函数");
        }
        this.register(name,formatter,{ language })
    }
                   
    /**
     * 当切换语言时，切换当前语言的格式化器
     * 当切换语言时，如果当前语言的格式化器集合还没有加载，则会自动加载
     * @param language 
     */
    async change(language:string){
        try {            
            let useLanguage = language
            if(!(language in this.formatters )){
                useLanguage = this.scope.getLanguage(language)?.fallback || "zh"
                this.scope.logger.warn(`没有配置<${language}>格式化器，使用后退语言<${useLanguage}>替代.`);
            }
			if (useLanguage){				
                const formatters = this.formatters[useLanguage]  
                if(isFunction(formatters)){                    
                    this._activeFormatters =  await loadAsyncModule(this,formatters as Function)   // 如果格式化器集合是异步加载，则需要等待加载完成
                }else{
                    this._activeFormatters = formatters as VoerkaI18nFormatters
                }
                // 合并生成格式化器的配置参数,当执行格式化器时该参数将被传递给格式化器
                this._cache = {typedFormatters:{},formatters:{}}  
                this.generateFormattersConfigs(useLanguage)
                this._language = language
			} else {
                this.scope.logger.warn(`未指定<${language}>格式化器配置(scope=${this.scope.id})`); 
			}
		} catch (e:any) {
            this.scope.logger.error(`当加载<${language}>格式化器时出错(scope=${this.scope.id}): ${e.stack}`);
		}
    } 
    private generateFormattersConfigs(language:string){               
        try{
            const configSources = [ ]   
            const fallbackLanguage = this.scope.getLanguage(language)?.fallback ;
            if(this.scope){  // 从全局Scope读取
                if(fallbackLanguage) configSources.push(this.scope.manager.formatters.getConfig(fallbackLanguage))
                configSources.push(this.scope.manager.formatters.getConfig("en"))
                configSources.push(this.scope.manager.formatters.getConfig(language))                
            }
            // 从当前Scope读取
            configSources.push(this.getConfig('en'))
            if(fallbackLanguage) configSources.push(this.getConfig(fallbackLanguage))            
            configSources.push(this.getConfig(language))            
            // 合并当前语言的格式化器配置参数
            this._activeFormattersConfigs = configSources.reduce((finalConfig, curConfig)=>{
                if(isPlainObject(curConfig)) finalConfig = deepMerge(finalConfig,deepClone(curConfig),{$merge:'replace'})
                return finalConfig
            },{})
        }catch(e:any){
            if(this.scope.debug) console.error(`当生成<${language}>格式化器配置时出错(scope=${this.scope.id})：${e.stack}`)
            this._activeFormattersConfigs = {}
        }                         
    }
    updateConfig(language:string,config:VoerkaI18nFormatterConfigs){
        if(language in this._formatters ){
            let formatters  = this._formatters[language] as VoerkaI18nFormatters
            if(!("$config" in formatters)) formatters.$config = {}
             assignObject(formatters.$config as any ,config)
        }
        if(language === this._language){
            this.generateFormattersConfigs(language)
        }
    }
    /**
     * 注册指定语言的格式化器
     * @param language 
     * @param formatters 
     */
    registerLanguageFormatters(language:string,formatters:VoerkaI18nFormatters | VoerkaI18nFormattersLoader){
        this._formatters[language] = formatters
    } 
    
    /**
     * 注册格式化器
     *      * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * register(name,value=>{...})                                 // 注册到所有语言
     * register(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * register(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
     * register("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
     * register(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
     * register(name,value=>{...},{langauge:"zh,cht"})       
     * 
    * @param name  格式化器名称，如果名称是一个支持的日期类型，则格式化器将被注册为语言类型的格式化器
    * @param formatter 
    * @param language 将格式化器注册到指定语言，如果不指定或'*'，则注册到所有语言;
    *                 也可以指定将格式化器注册到多个语言
    * 
    */
    register(name:string | SupportedDateTypes, formatter:VoerkaI18nFormatter,options?:{ language?:  string | string[] , asGlobal?:boolean } ) {
        const { language='*' } = options || {};
        if (!isFunction(formatter) || typeof name !== "string") {
            throw new TypeError("格式化器必须是一个函数");
        }
        const languages = Array.isArray(language) ? language: language	? language.split(","): [];
        languages.forEach((lngName:string) => {             
            if(!(lngName in this._formatters))  this._formatters[lngName] = {}
            if(typeof(this._formatters[lngName])!="function"){
                if(!this._formatters[lngName]) this._formatters[lngName] = {}
                let lngFormatters = this._formatters[lngName] as any
                if (DataTypes.includes(name)) {                    
                    if(!lngFormatters.$types) lngFormatters.$types = {}
                    lngFormatters.$types![name] = formatter                    
                } else {
                    lngFormatters[name] = formatter;
                }
            }                
        });
    } 

    get formatters(){ return this._formatters }                 
 
    /**
     * 返回当前语言的的指定名称格式化器
     * @param name 格式化名称  也可以是数据类型名称
     *  
     * @param options = {
     *      inGlobal: true, // 是否从全局作用域中查找
     *      on: 
     *          scope    在当前作用域中查找
     *          types    在当前语言的数据类型格式化器中查找
     *  
     * }
     * 
     */
    get(name:string,options?:{ inGlobal:boolean, on: "scope" | "types"}):VoerkaI18nFormatter {  
        
       
    }    
     
}