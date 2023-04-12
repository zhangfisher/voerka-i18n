/**
 * 
 *  保存所有格式化器数据 * 
 * 
 * 
 */
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import type { VoerkaI18nScope } from './scope';
import { DataTypes } from './utils';
import { get as getByPath } from "flex-tools/object/get" 
import { isFunction } from 'flex-tools/typecheck/isFunction';
import { deepMerge } from 'flex-tools/object/deepMerge';
import { assignObject } from 'flex-tools/object/assignObject';
import { VoerkaI18nFormatter, 
        VoerkaI18nFormatters, 
        VoerkaI18nFormattersLoader, 
        VoerkaI18nLanguageFormatters, 
        SupportedDateTypes, 
        VoerkaI18nFormatterConfigs, 
        VoerkaI18nTypesFormatters  
} from './types'; 

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

export interface GetFormatterOptions{
    on:"types" | "scope"
    inGlobal?:boolean                                   // 在全局中查找
}

const EmptyFormatters:any = {
    $config:{},
    $types:{}
}

export interface VoerkaI18nScopeFormatterCache{
    typedFormatters:VoerkaI18nTypesFormatters,
    formatters     : Record<string,VoerkaI18nFormatter>,
}

export class VoerkaI18nFormatterRegistry{
    #formatters:VoerkaI18nLanguageFormatters = {} 
    #activeFormatters:VoerkaI18nFormatters = {}
    #activeFormattersConfigs :VoerkaI18nFormatterConfigs = {}
    #scope?:VoerkaI18nScope
    #language?:string                                                // 当前语言
    #formatterCache:VoerkaI18nScopeFormatterCache = {typedFormatters:{},formatters:{}}
    constructor(scope?:VoerkaI18nScope){ 
        this.#scope = scope        
    }
    get activeLanguage(){ 
        if(!this.#language) this.#language = this.#scope?.activeLanguage || "zh"
        return this.#language 
    }                   // 当前语言
    get scope(){ return this.#scope }
    /**
     * 当切换语言时，切换当前语言的格式化器
     * 当切换语言时，如果当前语言的格式化器集合还没有加载，则会自动加载
     * @param language 
     */
    async change(language:string){
        try {            
			if (language in this.formatters) {
				
                const formatters = this.formatters[language]  
                if(isFunction(formatters)){                    
                    this.#activeFormatters =  await (formatters as Function)()    // 如果格式化器集合是异步加载，则需要等待加载完成
                }else{
                    this.#activeFormatters = formatters as VoerkaI18nFormatters
                }
                // 合并生成格式化器的配置参数,当执行格式化器时该参数将被传递给格式化器
                this.#formatterCache = {typedFormatters:{},formatters:{}}  
                this.generateFormattersConfigs(language)
                this.#language = language
			} else {
				if (this.scope?.debug) console.warn(`Not configured <${language}> formatters.`);
			}
		} catch (e:any) {
			if (this.scope?.debug) console.error(`Error loading ${language} formatters: ${e.message}`);
		}
    } 
    private generateFormattersConfigs(language:string){               
        try{
            const configSources = [ ]   
            const fallbackLanguage = this.scope?.getLanguage(language)?.fallback ;
            if(this.scope){  // 从全局Scope读取
                if(fallbackLanguage) configSources.push(this.scope.global.formatters.getConfig(fallbackLanguage))
                configSources.push(this.scope.global.formatters.getConfig(language))
            }
            // 从当前Scope读取
            if(fallbackLanguage) configSources.push(this.getConfig(fallbackLanguage))
            configSources.push(this.getConfig(language))
            // 合并当前语言的格式化器配置参数
            this.#activeFormattersConfigs = configSources.reduce((finalConfig, curConfig)=>{
                if(isPlainObject(curConfig)) finalConfig = deepMerge(finalConfig,curConfig,{array:'replace'})
                return finalConfig
            },{})
        }catch(e){
            if(this.scope?.debug) console.error(`Error while generate <${language}> formatter options: `,e)
            this.#activeFormattersConfigs = {}
        }                         
    }
    updateConfig(language:string,config:VoerkaI18nFormatterConfigs){
        if(language in this.#formatters ){
            let formatters  = this.#formatters[language] as VoerkaI18nFormatters
            if(!("$config" in formatters)) formatters.$config = {}
             assignObject(formatters.$config as any ,config)
        }
        if(language === this.#language){
            this.generateFormattersConfigs(language)
        }
    }
    /**
     * 注册指定语言的格式化器
     * @param language 
     * @param formatters 
     */
    registerLanguageFormatters(language:string,formatters:VoerkaI18nFormatters | VoerkaI18nFormattersLoader){
        this.#formatters[language] = formatters
    }
    /**
     * 加载所有格式化器
     * @param formatters 
     */
    loadInitials(formatters:VoerkaI18nLanguageFormatters){
        this.#formatters = formatters
    }
        /**
     * 注册格式化器
    * @param name  格式化器名称，如果名称是一个支持的日期类型，则格式化器将被注册为语言类型的格式化器
    * @param formatter 
    * @param language 将格式化器注册到指定语言，如果不指定或'*'，则注册到所有语言;
    *                 也可以指定将格式化器注册到多个语言
    * 
    */
    register(name:string | SupportedDateTypes, formatter:VoerkaI18nFormatter,options?:{ language?:  string | string[] } ) {
        const { language='*' } = options || {};
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
    //****************** 以下方法可以获取指定语言的格式化器 *********************** */
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

    //****************** 以下方法和属性只作用于当前语言 *********************** */

    get formatters(){ return this.#formatters }                     // 所有语言的格式化器集合
    get activeFormatters(){ return this.#activeFormatters }         // 当前语言的格式化器集合
    /**
     * 当前语言的格式化器配置
     */
    get config(){
        return this.#activeFormattersConfigs 
    }
    get types(){
        return (this.#activeFormatters  as VoerkaI18nFormatters).$types as VoerkaI18nFormatterConfigs
    }
    /**
     * 返回当前语言的的指定名称格式化器
     * @param name 格式化名称  也可以是数据类型名称
     *  
     * @param options = {
     *      inGlobal: true, // 是否从全局作用域中查找
     *      inTypes: true, // 是否从全局作用域中查找数据类型的格式化器
     *      inScope: true, // 是否从当前作用域中查找
     * }
     * 
     */

    get(name:string,options?:GetFormatterOptions):VoerkaI18nFormatter | undefined{             
        const {on,inGlobal} = assignObject({        
            on:"scope",
            inGlobal:true
        },options)

        // 直接从缓存中获取
        if(on=="types" && name in this.#formatterCache.typedFormatters) return this.#formatterCache.typedFormatters[name as SupportedDateTypes]
        if(on=="scope" && name in this.#formatterCache.formatters) return this.#formatterCache.formatters[name]

        const fallbackLanguage = this.scope?.getLanguage(this.activeLanguage)?.fallback  
        
        // 先在当前作用域中查找，再在全局查找
        const targets =[]

        if(on=="types"){
            targets.push(this.types)
            if(fallbackLanguage) targets.push(this.getTypes(fallbackLanguage))
            targets.push(this.getTypes("*"))       
            if(inGlobal){
                targets.push(this.scope?.global.formatters.types)
                if(fallbackLanguage) targets.push(this.scope?.global.formatters.getTypes(fallbackLanguage))
                targets.push(this.scope?.global.formatters.getTypes("*"))        
            }            
        }else if(on=='scope'){
            targets.push(this.#activeFormatters)
            if(fallbackLanguage) targets.push(this.getFormatters(fallbackLanguage))
            targets.push(this.getFormatters("*"))
            if(inGlobal){
                targets.push(this.scope?.global.formatters.activeFormatters)
                if(fallbackLanguage) targets.push(this.scope?.global.formatters.getFormatters(fallbackLanguage))
                targets.push(this.scope?.global.formatters.getFormatters("*"))        
            }
        }
        // 查找指定名称的格式化器
        for (const target of targets) {
            if (!target) continue;
            if(target && name in target){
                const formatter = target[name]
                if (isFunction(formatter)) {
                    // 缓存起来，下次直接返回避免重复查找
                    if(on=="types"){
                        this.#formatterCache.typedFormatters[name as SupportedDateTypes] = formatter
                    }else{
                        this.#formatterCache.formatters[name] = formatter
                    }
                    return formatter
                }
            }		
        }
    }    
}