import { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import { createElement } from "react"

export type createServerTranslateComponentOptions = {
    tagName?  : string 
}

export function createServerTranslateComponent(options?:createServerTranslateComponentOptions){        
    const { tagName } = Object.assign({},options) as createServerTranslateComponentOptions
    return function(scope:VoerkaI18nScope ){
        return async (props:VoerkaI18nTranslateProps & { message: string})=>{
            const { message, vars, options:tOptions } = props
            const scopeAttr = scope.library ? { 'data-scope': scope.$id } : {}
            return tagName ?
                    createElement(tagName,{
                        dangerouslySetInnerHTML: {__html:message},
                        className              : "vt-msg s" ,
                        "data-id"              : props.message,
                        ...scopeAttr
                    })
                    : (
                        <span 
                            className="vt-msg s" 
                            data-id={props.message}
                            {...scopeAttr}
               
                        >{scope.t(message as string,vars,tOptions)}
                    </span>
                    )
        } 
    }
}
  