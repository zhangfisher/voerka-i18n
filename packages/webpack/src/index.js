const {   
    applyIdMap,
    getIdMap 
} = require('@voerkai18n/utils')
   
const curIdMap = getIdMap()

function voerkaI18nLoader(code) { 
    const { idMap } =Object.assign({},this.query) 
    try{   
        return applyIdMap(code,curIdMap || idMap)     
    }catch(e){
        console.error("[voerkai18n-loader]",this.resourcePath,e.stack)
    }
    return content
}

module.exports = voerkaI18nLoader;
