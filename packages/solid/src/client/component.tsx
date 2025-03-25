/**
 * 
 *  翻译组件
 */

import { createSignal, onCleanup, Component, onMount } from 'solid-js';
import { Dynamic } from "solid-js/web"
import { type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, loadAsyncModule } from "@voerkai18n/runtime" 
 

export type CreateClientTranslateComponentOptions = {
    tagName?  : string
    attrs?    : Record<string,string>        
    class?    : string
    style?    : any
    loading?  : Component
}
  

export type SolidClientTranslateComponentType = Component<VoerkaI18nTranslateProps>

export type VoerkaI18nSolidClientTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<SolidClientTranslateComponentType>


export function createClientTranslateComponent(options?:CreateClientTranslateComponentOptions):VoerkaI18nSolidClientTranslateComponentBuilder{        
    const { tagName,attrs={}, class:className = 'vt-msg' ,style:gStyle, loading:LoadingComponent } = Object.assign({ },options) as CreateClientTranslateComponentOptions
    const hasLoading:boolean = !!LoadingComponent

    return function(scope:VoerkaI18nScope){
        return ((props: VoerkaI18nTranslateProps) => {
            const { id: paragraphId, message, vars, options: tOptions, default: tDefault = '' } = props;

            const isParagraph: boolean = typeof paragraphId === 'string' && paragraphId.length > 0;

            const [result, setResult] = createSignal(() => {
                if (isParagraph) {
                    return props.children;
                } else {
                    return typeof message === 'function' ? tDefault : scope.translate(message!, vars, tOptions);
                }
            });

            const [loading, setLoading] = createSignal(false);
            const tag = props.tag || tagName;
            const msgId = scope.getMessageId(props.message);
            const showLoading = isParagraph || typeof message === 'function';

            const loadMessage = async (language: string) => {
                const loader = typeof message === 'function' ? () => message(language, vars, tOptions) : () => message;
                try {
                    const resultValue = await Promise.resolve(loader());
                    setResult(scope.translate(resultValue!, vars, tOptions));
                } catch (e) {
                    console.error(e);
                }
            };

            const loadParagraph = async () => {
                if (paragraphId) {
                    const loader = scope.activeParagraphs[paragraphId];
                    if (!loader) return;
                    if (hasLoading) setLoading(true);
                    try {
                        const paragraphText = await loadAsyncModule(loader);
                        setResult(paragraphText);
                    } catch (e: any) {
                        console.error(e);
                    } finally {
                        if (hasLoading) setLoading(false);
                    }
                }
            };

            const refresh = (language: string) => {
                if (isParagraph) {
                    loadParagraph();
                } else {
                    loadMessage(language);
                }
            };
            
            onMount(() => {
                scope.ready(refresh)    
                const listener = scope.on('change', refresh) as any;
                onCleanup(() => {
                    listener && listener.off()
                });
            });

            if (msgId) attrs['data-id'] = msgId;
            if (paragraphId) attrs['data-id'] = paragraphId;
            if (scope.library) attrs['data-scope'] = String(scope.$id);

            if (tag || isParagraph) {
                return (
                    <Dynamic
                        component={tag || 'div'}
                        {...attrs}
                        class={className}
                        style={{ position: 'relative', ...gStyle, ...props.style }}
                    >
                        {result()}
                        {showLoading && hasLoading && loading() ? LoadingComponent : null}
                    </Dynamic>
                );
            } else {
                return <>{result()}</>;
            }  
        })
    }
}
