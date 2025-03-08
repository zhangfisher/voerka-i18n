import type { VoerkaI18nScope } from '@voerkai18n/runtime';
import Count from './count.svelte'; 

export type CreateTranslateComponentOptions = {

}

export function createTranslateComponent(options?:CreateTranslateComponentOptions) {
    return (scope: VoerkaI18nScope) => {
        return (anchor:any, props:any)=>{
            if(!props) props = {}
            props.scope = scope
            return Count(anchor, props)
        }
    }
}

