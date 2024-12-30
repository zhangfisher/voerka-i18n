import { FlexFilter, FlexVars } from "flexvars"
import type { VoerkaI18nScope, VoerkaI18nScopeFormatterContext } from ".."

export class InterpolatorMixin{                           
    protected _createInterpolators(this:VoerkaI18nScope){        
        this._flexVars = new FlexVars<VoerkaI18nScopeFormatterContext>({
            getFilter:(name)=>{
               return this.formatters.get(name) as FlexFilter<any,any>
            },
            filterContext:{
                getFormatterConfig:(configKey?:string)=>{
                    if(!configKey) return {}                    
                    const configs = (this.currentMessages['$config'] || {}) as any
                    return configs[configKey as any] || {}
                }
            }
        })
    }
}