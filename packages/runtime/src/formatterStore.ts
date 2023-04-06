import { isFunction } from "flex-tools/typecheck/isFunction";
import { SupportedDateTypes, VoerkaI18nFormatter, VoerkaI18nLanguageFormatters } from "./types";
import { DataTypes } from "./utils";


export class FormatterStore{
    #formatters:VoerkaI18nLanguageFormatters = {}
    constructor(formatters?:VoerkaI18nLanguageFormatters){ 
        if(formatters) this.#formatters = formatters
    }
    get formatters(){ return this.#formatters }
    register(name:string | SupportedDateTypes, formatter:VoerkaI18nFormatter, {language = "*"}:{ language:  string | string[] } ) {
        if (!isFunction(formatter) || typeof name !== "string") {
			throw new TypeError("Formatter must be a function");
		}
		const languages = Array.isArray(language) ? language: language	? language.split(","): [];
        languages.forEach((lngName:string) => {             
            if(!(lngName in this.#formatters))  this.#formatters[lngName] = {}
            if(typeof(this.#formatters[lngName])!="function"){
                let lngFormatters = this.#formatters[lngName] as any
                if (DataTypes.includes(name)) {                    
                    if(!lngFormatters.$types) lngFormatters.$types = {}
                    lngFormatters.$types![name] = formatter                    
                } else {
                    lngFormatters[name] = formatter;
                }
            }                
        });
	}
    getLanguageFormatters(language:string){ 
        if(language in this.#formatters){
            return this.#formatters[language]
        }else{
            return this.#formatters["*"]
        }
    }
}