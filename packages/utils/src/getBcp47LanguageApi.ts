
export function getBcp47LanguageApi(osLocale:string = 'en-US') {
    try{
        return require(`bcp47-language-tags/${osLocale.split("-")[0]}`)
    }catch(e){
        return require("bcp47-language-tags/en")
    }    
}
