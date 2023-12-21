import { createContext,useState, useEffect,useContext,useCallback, InulaNode} from 'openinula';
import type {VoerkaI18nLanguageDefine,VoerkaI18nTranslate,VoerkaI18nScope} from "@voerkai18n/runtime"


 
export const VoerkaI18nContext = createContext< {
    language?:string
    changeLanguage:(newLanguage:string)=>Promise<void> 
    defaultLanguage?:string   
    activeLanguage?:string   
    languages:VoerkaI18nLanguageDefine[]
    t:VoerkaI18nTranslate
}>({
    languages:[],
    activeLanguage:'zh',
    defaultLanguage:undefined,
    changeLanguage:async () =>{},
    t:()=>''
})

VoerkaI18nContext.displayName = 'VoerkaI18nProvider'

export type VoerkaI18nProviderProps = { 
    scope:VoerkaI18nScope
    fallback:InulaNode,
    children?:InulaNode

}

export function VoerkaI18nProvider(props:VoerkaI18nProviderProps){
    const { scope,fallback } = props
    const [language, setLanguage ] = useState(VoerkaI18n.activeLanguage); 
    const [isReady, setIsReady ] = useState(false);
    
    useEffect(() => { 
        function onChangeLanguage(newLanguage:string) {
            setLanguage(newLanguage) 
        }        
        VoerkaI18n.ready().then(()=>setIsReady(true))
        const listenerId:any = VoerkaI18n.on("change",onChangeLanguage)
      return () => VoerkaI18n.off(listenerId)
    },[]);

    const changeLanguage = useCallback((newLanguage:string) => {
        return VoerkaI18n.change(newLanguage).then((lng) => {
            setLanguage(lng) 
        })
    },[language])

    const value ={
        changeLanguage,
        activeLanguage:language,            
        defaultLanguage:VoerkaI18n.defaultLanguage,
        languages:VoerkaI18n.languages,
        t:scope.t
    }
    return (
        <VoerkaI18nContext.Provider value={value}>
            {(!isReady && fallback) ? props.fallback : props.children}
        </VoerkaI18nContext.Provider>
    )
}

export function useVoerkaI18n() {
    return useContext(VoerkaI18nContext)
}
  