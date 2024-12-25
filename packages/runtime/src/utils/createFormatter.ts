import type { FlexFilter } from "flexvars";
import type { VoerkaI18nScope } from "../scope";
import { Dict } from "../types";

export type FormatterBuilder<
    Args extends Dict    = Dict,
    Options extends Dict = Dict
> = (scope: VoerkaI18nScope, options:{ getActiveOptions: ()=>Options })=>FlexFilter<Args>

export function createFormatter<
    Args extends Dict    = Dict,
    Options extends Dict = Dict
>(
    builder  : FormatterBuilder<Args,Options>,
    options? : Record<string,Partial<Options>>
){
    return (scope: VoerkaI18nScope)=>{        
        const opts = {
            getActiveOptions: ()=>{
                if(!options) return {}
                const activeOptions =  Object.assign({},options?.en || {})
                Object.assign(activeOptions,options[scope.activeLanguage as string] || {}) 
                return activeOptions
            }
        }
        return builder(scope, opts as any) as unknown as FormatterBuilder<Args,Options>
    }    
}



createFormatter((scope: VoerkaI18nScope)=>{
    return {
        name: "number",
        args:["precision","division"],
        default:  {
                division      : 3,          // , 分割位，3代表每3位添加一个, 
                precision     : -1          // 精度，即保留小数点位置,-1代表保留所有小数位数 
            
        },
        next(value:any,args){
            return ""
        }
    } 
},{})
createFormatter((scope: VoerkaI18nScope,opts)=>{
    return {
        name: "number",
        args:["precision","division"],
        default:  {
            division      : 3,          // , 分割位，3代表每3位添加一个, 
            precision     : -1          // 精度，即保留小数点位置,-1代表保留所有小数位数             
        },
        next(value:any,args){
            return ""
        }
    } 
},{})