/**
 * 
 *  翻译组件
 */

import { createSignal, createEffect, onCleanup, Component } from 'solid-js';
import { clientOnly } from "@solidjs/start";
import { Dynamic } from "solid-js/web"
import { type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, loadAsyncModule } from "@voerkai18n/runtime" 
 

export type CreateTranslateComponentOptions = {
    tagName?  : string
    attrs?    : Record<string,string>        
    class?    : string
    style?    : any
    loading?  : Component
}
  

export type SolidTranslateComponentType = Component<VoerkaI18nTranslateProps>

export type VoerkaI18nSolidTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<SolidTranslateComponentType>


export function createTranslateComponent(options?:CreateTranslateComponentOptions):VoerkaI18nSolidTranslateComponentBuilder{        
    const { tagName,attrs={}, class:className = 'vt-msg' ,style:gStyle, loading:LoadingComponent } = Object.assign({ },options) as CreateTranslateComponentOptions
    const hasLoading:boolean = !!LoadingComponent

    return function(scope:VoerkaI18nScope){
        return clientOnly((props: VoerkaI18nTranslateProps) => {
            const { id: paragraphId, message, vars, options: tOptions, default: tDefault = '' } = props;

            const isParagraph: boolean = typeof paragraphId === 'string' && paragraphId.length > 0;

            const [result, setResult] = createSignal(() => {
            if (isParagraph) {
                return props.children;
            } else {
                return typeof message === 'function' ? tDefault : scope.translate(message!, vars, tOptions);
            }
            });

            const [first,setFirst] = createSignal(false);
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

            // First render logic
            if (!first() && (typeof message === 'function' || isParagraph)) {
                refresh(scope.activeLanguage);
                setFirst(true);
            }

            createEffect(() => {
                const listener = scope.on('change', refresh) as any;
                onCleanup(() => listener.off());
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
