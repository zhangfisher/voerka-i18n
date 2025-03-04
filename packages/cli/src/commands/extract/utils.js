
function getDefaultLanguage(languages){
    return languages.find(lng=>lng.default) || languages[0]
}


module.exports = {
    getDefaultLanguage
}