import type { VoerkaI18nScope, VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import translate from './translate.svelte'; 
import type {Component } from "svelte"

export type CreateTranslateComponentOptions = {

}

export function createTranslateComponent(options?:CreateTranslateComponentOptions) {
    return (scope: VoerkaI18nScope) => {
        return (anchor:any, props:any)=>{
            if(!props) props = {}
            props.scope = scope
            return translate(anchor, props)
        }
    }
}

export type VoerkaI18nSvelteTranslateComponent = Component<VoerkaI18nTranslateProps>