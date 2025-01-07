/**
 * 
 *  保存所有格式化器数据
 * 
 * 
 */
import { create } from 'domain';
import type { VoerkaI18nScope } from '../scope';        
import { VoerkaI18nFormatter, VoerkaI18nFormatterBuilder, VoerkaI18nFormatters } from './types';
import { createFormatter } from './utils';
import { Dict } from '@/types';

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
        this._loadFormatters()
    }    
    get scope(){ return this._scope! }      
    get formatters(){ return this._formatters }    
    /**
     * 
     * 加载所有格式化器
     * 
     */
    private _loadFormatters(){
        this._formatters && this._formatters.forEach((builder)=>{
            this._registerFormatter(builder)
        })        
    }  
    private _registerFormatter(builder:VoerkaI18nFormatterBuilder<any,any>){
        const filter = builder(this.scope)
        try{
            this.scope.interpolator.addFilter(filter)
            // 如果是全局格式化器，则注册到全局scope(即appCcope)里面
            if(filter.global){
                this.scope.manager.scope.formatters.register(filter)
            }
        }catch(e:any){
            this.scope.logger.error(`注册格式化器<${filter.name}>失败：${e.stack}`)
        }
    }
    /**
    * 动态注册格式化器
    */
    register<Args extends Dict,Config extends  Dict = Args>(formatter:VoerkaI18nFormatter<Args,Config>,configs?: Partial<Record<string,Partial<Config>>>){  
        const builder =  createFormatter(formatter,configs) 
        this._registerFormatter(builder)
    }     
}