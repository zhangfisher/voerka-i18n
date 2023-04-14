import { VoerkaI18nScope } from '../../scope' 
import { deepMerge } from 'flex-tools/object/deepMerge';
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import { assignObject } from 'flex-tools/object/assignObject';
import {languages, messages,formatters} from './testData'


export function mergeFormattersConfigs(configSources:any[]){        
    return configSources.reduce((finalConfig, curConfig)=>{
        if(isPlainObject(curConfig)) deepMerge(finalConfig,curConfig,{newObject:false,array:'replace'})
        return finalConfig
    },{})                      
}


export interface CreateI18nScopeOptions{
    id?:string,
    ready?:Function
}
export function createI18nScope(options?:CreateI18nScopeOptions){
    const {id,ready} = assignObject({
        id:"test",
    },options)
    return new VoerkaI18nScope({
        id,
        languages, 
        messages,
        formatters,
        ready
    })
}