import { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import { createElement } from "react"
import type { ReactTranslateComponentType } from "@voerkai18n/react"
import { isNumber } from "flex-tools/typecheck/isNumber"

export type createServerTranslateComponentOptions = {
    tagName?  : string 
}

export function createServerTranslateComponent(options?:createServerTranslateComponentOptions){        
    const { tagName } = Object.assign({},options) as createServerTranslateComponentOptions
    return function(scope:VoerkaI18nScope ){
        return async (props:VoerkaI18nTranslateProps & { message: string})=>{
            const { message, vars, options:tOptions } = props
            const scopeAttr = scope.library ? { 'data-scope': scope.$id } : {}
            const msgId = isNumber(message) ? message : scope.options.idMap[message] || message
            return tagName ?
                    createElement(tagName,{
                        className              : "vt-msg s" ,
                        "data-id"              : msgId,
                        ...scopeAttr
                    },message)
                    : (
                        <span 
                            className="vt-msg s" 
                            data-id={msgId}
                            {...scopeAttr}
               
                        >{scope.t(message as string,vars,tOptions)}
                    </span>
                    )
        } 
    }
}
  
export type ReactServerTranslateComponentType = React.FC<VoerkaI18nTranslateProps>
