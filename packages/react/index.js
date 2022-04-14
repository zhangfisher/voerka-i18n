import React, { useState, useEffect,useCallback } from 'react';

/**
 * MyComponent(){
 *      const { activeLanguage, changeLanguage } = useVoerkaI18n()
 *      
 * 
 * }
 * 
 * 
 */
export function useVoerkaI18n(i18nScope) {
    
    if(!globalThis.VoerkaI18n){
        console.warn("useI18nContext is not provided, use default i18nContext")
    }

    const [activeLanguage, setLanguage ] = useState(VoerkaI18n.activeLanguage);
  
    async function changeLanguage(newLanguage) { 
        return VoerkaI18n.change(newLanguage) 
    }    

    useEffect(() => { 
        function onChangeLanguage(newLanguage) {
            setLanguage(newLanguage)
        }
        VoerkaI18n.on(onChangeLanguage)
      return () => {
        VoerkaI18n.off(onChangeLanguage)
      };
    });
  
    return {
        activeLanguage,
        changeLanguage,
        languages:VoerkaI18n.languages, 
    }
}
