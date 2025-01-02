/**
 * 
 * 从存储中恢复语言
 * 
 */
import { IVoerkaI18nStorage } from "@/types"
import type { VoerkaI18nScope } from ".."
import { isStorage } from "@/utils/isStorage"


export class RestoreMixin{
    private _getStorage(this:VoerkaI18nScope):IVoerkaI18nStorage | undefined{
        const storage = this.storage 
        return isStorage(storage) ? storage: undefined
    }
    /**
     * 从存储器加载语言包配置
     */
    private _getLanguageFromStorage(this:VoerkaI18nScope){
        const storage = this._getStorage()
        if(storage){            
            const savedLanguage = storage.get("language")
            if(!savedLanguage || !this.hasLanguage(savedLanguage))  return 
            this._activeLanguage = savedLanguage
            this.logger.debug("从存储中读取到当前语言：",savedLanguage)
        }
    }
    private _setLanguageToStorage(this:VoerkaI18nScope){
        const storage = this._getStorage()
        if(storage){
            if(!this._activeLanguage)  return
            storage.set("language",this.activeLanguage)            
            this.logger.debug("当前语言设置已保存到存储：",this.activeLanguage)
        }
    }  
}