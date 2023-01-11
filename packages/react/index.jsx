import React, { useState, useEffect,useContext,useCallback} from 'react';
 
export const VoerkaI18nContext = React.createContext({
    languages:null,
    language:'zh',
    defaultLanguage:null,
    changeLanguage:() => {},
    t:()=>{}
})
VoerkaI18nContext.displayName = 'VoerkaI18nProvider'


export function VoerkaI18nProvider(props){
    const { scope } = props
    const [language, setLanguage ] = useState(VoerkaI18n.activeLanguage); 
    useEffect(() => { 
        function onChangeLanguage(newLanguage) {
            setLanguage(newLanguage) 
        }        
        VoerkaI18n.on(onChangeLanguage)
      return () => {
        VoerkaI18n.off(onChangeLanguage)
      };
    });
    const changeLanguage = useCallback((newLanguage) => {
        VoerkaI18n.change(newLanguage).then((lng) => {
            setLanguage(lng) 
        })
    },[language])
    return (
        <VoerkaI18nContext.Provider value={{
            language,
            changeLanguage,
            defaultLanguage:VoerkaI18n.defaultLanguage,
            languages:VoerkaI18n.languages,
            t:scope.t
        }}>
            {props.children}
        </VoerkaI18nContext.Provider>
    )
}

export function useVoerkaI18n() {
    return useContext(VoerkaI18nContext)
}

/**
 * MyComponent(){
 *      const { activeLanguage, changeLanguage } = useVoerkaI18n()
 *      
 * 
 * }
 * 
 * 
 */
// export function useVoerkaI18n() {
    
//     if(!globalThis.VoerkaI18n){
//         console.warn("useI18nContext is not provided, use default i18nContext")
//     }

//     const [activeLanguage, setLanguage ] = useState(VoerkaI18n.activeLanguage);
  
//     async function changeLanguage(newLanguage) { 
//         return VoerkaI18n.change(newLanguage) 
//     }    

//     useEffect(() => { 
//         function onChangeLanguage(newLanguage) {
//             setLanguage(newLanguage)
//         }
//         VoerkaI18n.on(onChangeLanguage)
//       return () => {
//         VoerkaI18n.off(onChangeLanguage)
//       };
//     });
  
//     return {
//         activeLanguage,
//         changeLanguage,
//         languages:VoerkaI18n.languages, 
//     }
// }



