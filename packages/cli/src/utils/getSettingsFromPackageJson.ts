import { VoerkaI18nPackageJsonSettings } from "@voerkai18n/runtime"
import { getPackageJson } from "flex-tools/dist/package/getPackageJson"

/**
 * 
 * 从当前文件的package.json读取voerkai18n配置
 * 
 */
export function getSettingsFromPackageJson(entry?:string):VoerkaI18nPackageJsonSettings{
	const pkg =  getPackageJson(entry)
    const settings = {
        entry: undefined
    }
	if(typeof(pkg)=='object' &&  "voerkai18n" in pkg){
		Object.assign(settings,pkg.voerkai18n)
	} 
	return settings
}