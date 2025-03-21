import type { VoerkaI18nScope, VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import translate from './translate.svelte'; 
import type { Component } from "svelte"
import type { CreateTranslateComponentOptions } from './types';


export function createTranslateComponent(options?:CreateTranslateComponentOptions) {
    return (scope: VoerkaI18nScope) => {
        return (anchor:any, props:any)=>{
            if(!props) props = {}
            props.$context = Object.assign({
                attrs:{},                
                scope,
            },options)
            return translate(anchor, props)
        }
    }
}

export type SvelteTranslateComponent = Component<VoerkaI18nTranslateProps>

