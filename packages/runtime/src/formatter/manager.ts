/**
 * 
 *  保存所有格式化器数据
 *  
 */
import { Dict, LanguageName } from '@/types';
import type { VoerkaI18nScope } from '../scope';        
import { VoerkaI18nFormatter, VoerkaI18nFormatterBuilder, VoerkaI18nFormatters } from './types';
 
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
    private _formatters        : VoerkaI18nFormatters = [] 
    private _scope             : VoerkaI18nScope                                         

    constructor(scope:VoerkaI18nScope){ 
        this._scope = scope   
        this._formatters = scope?.options.formatters     
        this._registerFormatters()
    }    
    get scope(){ return this._scope! }      
    get formatters(){ return this._formatters }    
    /** 
     * 加载所有格式化器 
     */
    private _registerFormatters(){
        this._formatters && this._formatters.forEach((formatter)=>{
            if(Array.isArray(formatter)){
                this.register.apply(this,formatter as any);
            }else{
                this.register.apply(this,[formatter]);
            }
        })        
    }   
    private _addFormatter(filter:VoerkaI18nFormatter<any,any>){
        try{
            this.scope.interpolator.addFilter(filter)
            // 如果是全局格式化器，则注册到全局scope(即appCcope)里面
            if(filter){
                const appScope = this.scope.manager.scope
                if(appScope.id !== this.scope.id){
                    appScope.interpolator.addFilter(filter)
                }
            }
        }catch(e:any){
            this.scope.logger.error(`fail while register formatter<${filter.name}>：${e.stack}`)
        }
    }
    register<Args extends Dict,Config extends  Dict = Args>(
        formatter: VoerkaI18nFormatter<Args, Config>,
        configs? : Partial<Record<LanguageName,Partial<Config>>>,
        defaultConfig? : Partial<Config>
    ){
        const scope = this.scope
        const oldNext = formatter.next
        formatter.next = function (value, args, ctx) {
            const langConfig = ctx.getConfig as any // 语言包中的$config
            ctx.getConfig = () => {
                return Object.assign({}, 
                    defaultConfig,
                    configs?.[scope.activeLanguage],                    
                    langConfig(formatter.name),                    
                ) as Config;
            }
            return oldNext.call(this, value, args, ctx);
        }  
        // 
        this._addFormatter(formatter) 
    }

}