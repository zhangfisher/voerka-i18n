import { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import { isNumber } from "flex-tools/typecheck/isNumber"
import { Dynamic } from "solid-js/web"

export type createServerTranslateComponentOptions = {
    tagName?  : string 
}

export function createServerTranslateComponent(options?:createServerTranslateComponentOptions){        
    const { tagName } = Object.assign({},options) as createServerTranslateComponentOptions
    return function(scope:VoerkaI18nScope ){
        return (props: VoerkaI18nTranslateProps & { message: string }) => {
            const { message, vars, options: tOptions } = props;
            const scopeAttr = scope.library ? { 'data-scope': scope.$id } : {};
            const msgId = isNumber(message) ? message : scope.options.idMap[message] || message;
            return tagName ? (
                <Dynamic
                    component={tagName}
                    class="vt-msg s"
                    data-id={msgId}
                    {...scopeAttr}
                >
                    {message}
                </Dynamic>
                ) : (
                <span
                    class="vt-msg s"
                    data-id={msgId}
                    {...scopeAttr}
                >
                    {scope.t(message as string, vars, tOptions)}
                </span>
            );
        };
    }
}
  
export type ServerTranslateComponentType = React.FC<VoerkaI18nTranslateProps>
