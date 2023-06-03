/**
 * 
 *  保存所有格式化器数据 * 
 * 
 * 
 */
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import type { VoerkaI18nScope } from './scope';
import { DataTypes, loadAsyncModule } from './utils';
import { get as getByPath } from "flex-tools/object/get" 
import { isFunction } from 'flex-tools/typecheck/isFunction';
import { deepMerge } from 'flex-tools/object/deepMerge';
import { assignObject } from 'flex-tools/object/assignObject';
import { DefaultFallbackLanguage } from './consts';
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
    private _formatters:VoerkaI18nLanguageFormatters = {} 
    private _activeFormatters:VoerkaI18nFormatters = {}
    private _activeFormattersConfigs :VoerkaI18nFormatterConfigs = {}
    private _scope?:VoerkaI18nScope
    private _language?:string                                                // 当前语言
    private _formatterCache:VoerkaI18nScopeFormatterCache = {typedFormatters:{},formatters:{}}
    constructor(scope?:VoerkaI18nScope){ 
        this._scope = scope        
    }
    get activeLanguage(){ 
        if(!this._language) this._language = this._scope?.activeLanguage || "zh"
        return this._language 
    }                   // 当前语言
    get scope(){ return this._scope }
    /**
     * 当切换语言时，切换当前语言的格式化器
     * 当切换语言时，如果当前语言的格式化器集合还没有加载，则会自动加载
     * @param language 
     */
    async change(language:string){
        try {            
            let useLanguage = language
            if(!(language in this.formatters )){
                useLanguage = this.scope?.getLanguage(language)?.fallback || "zh"
                this.scope?.logger.warn(`没有配置<${language}>格式化器，使用后退语言<${useLanguage}>替代.`);
            }
			if (useLanguage){				
                const formatters = this.formatters[useLanguage]  
                if(isFunction(formatters)){                    
                    this._activeFormatters =  await loadAsyncModule(this,formatters as Function)   // 如果格式化器集合是异步加载，则需要等待加载完成
                }else{
                    this._activeFormatters = formatters as VoerkaI18nFormatters
                }
                // 合并生成格式化器的配置参数,当执行格式化器时该参数将被传递给格式化器
                this._formatterCache = {typedFormatters:{},formatters:{}}  
                this.generateFormattersConfigs(useLanguage)
                this._language = language
			} else {
                this.scope?.logger.warn(`未指定<${language}>格式化器配置(scope=${this.scope?.id})`); 
			}
		} catch (e:any) {
            this.scope?.logger.error(`当加载<${language}>格式化器时出错(scope=${this.scope?.id}): ${e.stack}`);
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
            this._activeFormattersConfigs = configSources.reduce((finalConfig, curConfig)=>{
                if(isPlainObject(curConfig)) deepMerge(finalConfig,curConfig,{$merge:'replace'})
                return finalConfig
            },{})
        }catch(e:any){
            if(this.scope?.debug) console.error(`当生成<${language}>格式化器配置时出错(scope=${this.scope?.id})：${e.stack}`)
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
     * 加载所有格式化器
     * @param formatters 
     */
    loadInitials(formatters:VoerkaI18nLanguageFormatters){
        this._formatters = formatters
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
    //****************** 以下方法可以获取指定语言的格式化器 *********************** */
    /**
     * 获取指定语言的格式化器配置
     * @param language 
     */
    getConfig(language?:string){
        return language ? getByPath(this._formatters,`${language}.$config`,{defaultValue:{}}) : {}                
    }
    /**
     获取指定语言中为每个数据类型指定的格式化器
     */
    getTypes(language?:string){
        return language ? getByPath(this._formatters,`${language}.$types`,{defaultValue:{}}) : {}                
    }
    /**
     获取指定语言中为每个数据类型指定的格式化器
     */
    getFormatters(language?:string){
        return language ? getByPath(this._formatters,language,{defaultValue:{}}) : {}                
    } 

    //****************** 以下方法和属性只作用于当前语言 *********************** */

    get formatters(){ return this._formatters }                     // 所有语言的格式化器集合
    get activeFormatters(){ return this._activeFormatters }         // 当前语言的格式化器集合
    /**
     * 当前语言的格式化器配置
     */
    get config(){
        return this._activeFormattersConfigs 
    }
    get types(){
        return (this._activeFormatters  as VoerkaI18nFormatters).$types as VoerkaI18nFormatterConfigs
    }
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
    get(name:string,options?:GetFormatterOptions):VoerkaI18nFormatter | undefined{             
        const {on,inGlobal} = assignObject({        
            on:"scope",
            inGlobal:true
        },options)

        // 直接从缓存中获取
        if(on=="types" && name in this._formatterCache.typedFormatters) return this._formatterCache.typedFormatters[name as SupportedDateTypes]
        if(on=="scope" && name in this._formatterCache.formatters) return this._formatterCache.formatters[name]

        const fallbackLanguage = this.scope?.getLanguage(this.activeLanguage)?.fallback  
        
        // 先在当前作用域中查找，再在全局查找
        const targets =[]
        if(on=="types"){
            targets.push(this.types)
            if(fallbackLanguage) targets.push(this.getTypes(fallbackLanguage))
            if(fallbackLanguage!=DefaultFallbackLanguage) targets.push(this.getTypes(DefaultFallbackLanguage))
            targets.push(this.getTypes("*"))       
            if(inGlobal){
                targets.push(this.scope?.global.formatters.types)
                if(fallbackLanguage) targets.push(this.scope?.global.formatters.getTypes(fallbackLanguage))
                if(fallbackLanguage!=DefaultFallbackLanguage) targets.push(this.scope?.global.formatters.getTypes(DefaultFallbackLanguage))
                targets.push(this.scope?.global.formatters.getTypes("*"))        
            }          

        }else if(on=='scope'){
            targets.push(this._activeFormatters)
            if(fallbackLanguage) targets.push(this.getFormatters(fallbackLanguage))
            if(fallbackLanguage!=DefaultFallbackLanguage) targets.push(this.getFormatters(DefaultFallbackLanguage))
            targets.push(this.getFormatters("*"))
            if(inGlobal){
                targets.push(this.scope?.global.formatters.activeFormatters)
                if(fallbackLanguage) targets.push(this.scope?.global.formatters.getFormatters(fallbackLanguage))
                if(fallbackLanguage!=DefaultFallbackLanguage) targets.push(this.scope?.global.formatters.getFormatters(DefaultFallbackLanguage))
                targets.push(this.scope?.global.formatters.getFormatters("*"))        
            }
        }
        // 查找指定名称的格式化器
        for (const target of targets) {
            if (!target) continue;
            if(isPlainObject(target) && name in target){
                const formatter = target[name]
                if (isFunction(formatter)) {
                    // 缓存起来，下次直接返回避免重复查找
                    if(on=="types"){
                        this._formatterCache.typedFormatters[name as SupportedDateTypes] = formatter
                    }else{
                        this._formatterCache.formatters[name] = formatter
                    }
                    return formatter
                }
            }		
        }
    }    
}