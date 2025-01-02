import { FlexVars } from "flexvars"
import type { VoerkaI18nScope, VoerkaI18nScopeFormatterContext } from ".."

export class InterpolatorMixin{
    protected _flexVars?        : FlexVars<VoerkaI18nScopeFormatterContext>          // 变量插值处理器,使用flexvars    
    protected _initInterpolators(this:VoerkaI18nScope){
        this._flexVars = new FlexVars<VoerkaI18nScopeFormatterContext>({
            filterContext:{
                getFormatterConfig:(configKey?:string)=>{
                    if(!configKey) return {}                    
                    const configs = (this.activeMessages['$config'] || {}) as any
                    return configs[configKey as any] || {}
                }
            }
        })
    }
}