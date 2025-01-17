import { getLanguageDir } from "./getLanguageDir";
import { getSettingsFromPackageJson } from "./getSettingsFromPackageJson";
import path from "node:path"
import fs from "node:fs"
import type { VoerkaI18nSettings } from "@voerkai18n/runtime";


export function getVoerkaI18nSettings():VoerkaI18nSettings{
    const packageJsonSettings = getSettingsFromPackageJson()    

    const langDir = getLanguageDir({
        autoCreate: false
    })
    const settings = Object.assign({},packageJsonSettings)
    const settingFile = path.join(langDir, "settings.json")
    if(fs.existsSync(settingFile)){
        Object.assign(settings, require(settingFile))
    }        
    return settings as VoerkaI18nSettings
}