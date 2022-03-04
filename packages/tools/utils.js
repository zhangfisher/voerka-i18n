 

async function importModule(url){
    try{
        return require(url)
    }catch{
        return await import(url)
    }    
}

module.exports = {
    importModule
}


