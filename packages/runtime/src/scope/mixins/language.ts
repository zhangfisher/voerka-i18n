import type { VoerkaI18nLanguageDefine } from "@/types";
import type { VoerkaI18nScope } from "..";


export class LanguageMixin{
	/**
	 * 获取指定语言信息
	 * @param {*} language
	 * @returns
	 */
	getLanguage(this:VoerkaI18nScope,language:string):VoerkaI18nLanguageDefine | undefined{
		let index = this.languages.findIndex((lng) => lng.name == language);
		if (index !== -1) return this.languages[index];
    }

    /**
     * 获取指定语言的备用语言。如果指定的语言存在备用语言选项，则返回该备用语言；否则返回默认语言。
     * @param this - VoerkaI18nScope 实例
     * @param language - 需要获取备用语言的目标语言代码
     * @returns 返回备用语言代码或默认语言代码
     */
    getFallbackLanguage(this: VoerkaI18nScope, language: string): string {
        const lngOptions = this.getLanguage(language)
		return (lngOptions && lngOptions.fallback)
					|| this.options.fallback
					|| this._defaultLanguage        
    }
	/**
	 * 返回是否存在指定的语言
	 * @param {*} language 语言名称
	 * @returns
	 */
	hasLanguage(this:VoerkaI18nScope,language:string) {
		return this.languages.findIndex((lang:VoerkaI18nLanguageDefine) => lang.name == language) != -1;
	} 
}

 