/**
 * 
 *  保存所有格式化器数据
 * 
 * 
 */
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import type { VoerkaI18nScope } from '../../scope';
import { DataTypes, loadAsyncModule } from '../../utils';
import { get as getByPath } from "flex-tools/object/get" 
import { isFunction } from 'flex-tools/typecheck/isFunction';
import { deepMerge } from 'flex-tools/object/deepMerge';
import { assignObject } from 'flex-tools/object/assignObject';
import { DefaultFallbackLanguage } from '../../consts';
import { VoerkaI18nFormatter, 
        VoerkaI18nFormatters, 
        VoerkaI18nFormattersLoader, 
        VoerkaI18nLanguageFormatters, 
        SupportedDateTypes, 
        VoerkaI18nFormatterConfigs, 
        VoerkaI18nTypesFormatters  
} from '../../types'; 
import { deepClone } from 'flex-tools/object/deepClone';
import inlineFormatters from "../../formatters"         

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

const EmptyFormatters = {
    $config:{},
    $types:{}
}
const EmptyFormater = (value:any)=>value
export interface VoerkaI18nScopeFormatterCache{
    typedFormatters : VoerkaI18nTypesFormatters,
    formatters      : Record<string,VoerkaI18nFormatter>,
}

export class VoerkaI18nFormatterManager{
    private _formatters        : VoerkaI18nLanguageFormatters = {} 
    private _activeFormatters  : VoerkaI18nFormatters = {}  
    private _fallbackFormatters: VoerkaI18nFormatters = {}  
    private _globalFormatters  : VoerkaI18nFormatters = {}  
    private _scope             : VoerkaI18nScope
    private _language?         : string                                               
    private _cache             : VoerkaI18nScopeFormatterCache = { typedFormatters:{}, formatters:{}}
    
    constructor(scope:VoerkaI18nScope){ 
        this._scope = scope   
        this._formatters = scope?.options.formatters    
        this._scope.on("change",this._onChange.bind(this))
    }    
    get scope(){ return this._scope! }     
    get cache(){ return this._cache }

    get activeFormatters(){ return this._activeFormatters }
    get fallbackFormatters(){ return this._fallbackFormatters }
    get globalFormatters(){ return this._globalFormatters }

    /**
     * 当语言变化时，重新生成格式化器
     */
    private _onChange(language:string){
        if(language !== this._language){
            this._clearCache()
            this._activeFormatters = getByPath(this._formatters,language,{defaultValue:EmptyFormatters}) 
            this._globalFormatters = getByPath(this._formatters,"*",{defaultValue:EmptyFormatters})
            const fallbackLanguage = this.scope.fallbackLanguage || 'en'
            this._fallbackFormatters = getByPath(this._formatters,fallbackLanguage,{defaultValue:EmptyFormatters})
        }
    }

    private _clearCache(){
        this._cache = {typedFormatters:{},formatters:{}}
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
    //****************** 以下方法可以获取指定语言的格式化器 *********************** */
    /**
     * 获取指定语言的格式化器配置
     * @param language 
     */
    private _getConfig(language?:string){
        return language ? getByPath(this._formatters,`${language}.$config`,{defaultValue:{}}) : {}                
    }
    /**
     获取指定语言中为每个数据类型指定的格式化器
     */
     private _getTypes(language?:string){
        return language ? getByPath(this._formatters,`${language}.$types`,{defaultValue:{}}) : {}                
    }
    /**
     获取指定语言中为每个数据类型指定的格式化器
     */
    private _getFormatters(language?:string){
        return language ? getByPath(this._formatters,language,{defaultValue:{}}) : {}                
    } 

    //****************** 以下方法和属性只作用于当前语言 *********************** */
    get inlineFormatters(){ return inlineFormatters }

    get formatters(){ return this._formatters }                 
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
    get(name:string,options?:{ inGlobal:boolean, on: "scope" | "types"}):VoerkaI18nFormatter { 
        
        
        
        const {inGlobal,on} = Object.assign({inGlobal:true,on:"scope"},options)
        // 直接从缓存中获取
        if(on === 'scope' && name in this._cache.formatters) return this._cache.formatters[name]                
        if(on === "types" && name in this._cache.typedFormatters) return this._cache.typedFormatters[name as SupportedDateTypes]

        const targets =[]    
        targets.push(this._activeFormatters)       
        targets.push(this._globalFormatters)
        targets.push(this._fallbackFormatters)        
        if(inGlobal){
            targets.push(this.scope.manager.formatters.activeFormatters)       
            targets.push(this.scope.manager.formatters.globalFormatters)
            targets.push(this.scope.manager.formatters.fallbackFormatters)        
        }
        // 查找指定名称的格式化器
        for (const target of targets) {
            if (!target) continue;
            if(name in target){
                const formatter = target[name]
                if (isFunction(formatter)) { 
                    this._cache.formatters[name] = formatter 
                    return formatter
                }
            }		
        } 
        return EmptyFormater
    }    
    
    

    getTyped(name:string,inGlobal:boolean = true){
                // 直接从缓存中获取
                if(name in this._cache.typedFormatters) return this._cache.typedFormatters[name as SupportedDateTypes]        
                const targets =[]    
                targets.push(this._activeFormatters)       
                targets.push(this._globalFormatters)
                targets.push(this._fallbackFormatters)        
                if(inGlobal){
                    targets.push(this.scope.manager.formatters.activeFormatters)       
                    targets.push(this.scope.manager.formatters.globalFormatters)
                    targets.push(this.scope.manager.formatters.fallbackFormatters)        
                }
                // 查找指定名称的格式化器
                for (const target of targets) {
                    if (!target) continue;
                    if(name in target){
                        const formatter = target[name]
                        if (isFunction(formatter)) { 
                            this._cache.formatters[name] = formatter 
                            return formatter
                        }
                    }		
                } 
                return EmptyFormater
                       
    }
}