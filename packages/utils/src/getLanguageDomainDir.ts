import { getLanguageDomains } from "./getLanguageDomains";

 
export function getLanguageDomainDir(name:string = 'default'):string{    
    const langDomains = getLanguageDomains()
    if(name in langDomains){
        return langDomains[name]
    }else{
        return langDomains.default
    }
}
