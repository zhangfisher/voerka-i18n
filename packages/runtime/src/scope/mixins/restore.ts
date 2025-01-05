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
     * 
     * @param this 
     */
    private _getStorageKey(this:VoerkaI18nScope){
        const storageKey = this.options.sorageKey       
        return storageKey.replace("{scope}",this.id)
    }
    /**
     * 从存储器加载语言配置
     */
    restoreLanguage(this:VoerkaI18nScope){
        const storage = this._getStorage()
        if(storage){      
            const storageKey = this._getStorageKey()      
            const savedLanguage = storage.get(storageKey)
            if(!savedLanguage || !this.hasLanguage(savedLanguage))  return 
            this._activeLanguage = savedLanguage
            this.logger.debug(`从存储<${storageKey}>中恢复保存的语言：${savedLanguage}`)
        }
    }
    /**
     * 
     * 将当前语言保存到Storage
     * 
     */
    saveLanguage(this:VoerkaI18nScope){
        const storage = this._getStorage()
        if(storage){
            if(!this._activeLanguage)  return
            const storageKey = this._getStorageKey()
            storage.set(storageKey,this.activeLanguage)            
            this.logger.debug(`当前语言已保存到存储${storageKey}=${this.activeLanguage}`)
        }
    }  
    clearLanguage(this:VoerkaI18nScope){
        const storage = this._getStorage()
        if(storage){
            storage.remove(this._getStorageKey())
        }
    }
    
}