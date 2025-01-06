import { FlexVars } from "flexvars"
import type { VoerkaI18nScope } from ".."
import {  get as getByPath } from "flex-tools/object/get"
import { VoerkaI18nFormatterContext } from "@/formatter/types"

export class InterpolatorMixin{
    protected _flexVars?        : FlexVars<VoerkaI18nFormatterContext>          // 变量插值处理器,使用flexvars    
    protected _initInterpolators(this:VoerkaI18nScope){
        this._flexVars = new FlexVars<VoerkaI18nFormatterContext>({
            filterContext:{
                getConfig:(configKey?:string)=>{
                    const configs = (this.activeMessages['$config'] || {}) as any
                    if(!configKey) return configs
                    return getByPath(configs,configKey)
                },
                scope:this
            }
        })
    }
}