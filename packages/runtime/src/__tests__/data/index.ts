import { VoerkaI18nScope } from '../../scope' 
import { deepMerge } from 'flex-tools/object/deepMerge';
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import { assignObject } from 'flex-tools/object/assignObject';
import {languages, messages,formatters, idMapData} from './testData'


export function mergeFormattersConfigs(configSources:any[]){        
    return configSources.reduce((finalConfig, curConfig)=>{
        if(isPlainObject(curConfig)) deepMerge(finalConfig,curConfig,{$merge:'replace'})
        return finalConfig
    },{})                      
}


export interface CreateI18nScopeOptions{
    id?:string,
    ready?:Function,
    idMap?:boolean,         // 启用消息id映射
}
export function createI18nScope(options?:CreateI18nScopeOptions){
    const {id,ready,idMap=false} = assignObject({
        id:"test",
    },options)
    return new VoerkaI18nScope({
        id,
        languages, 
        messages,
        formatters,
        ready,
        idMap: idMap ? idMapData : undefined
    })
}