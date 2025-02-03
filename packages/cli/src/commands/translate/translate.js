/**
 * 
 * @param {string} file
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 * 
 */
async function translateFile(file,ctx){
    const content = await readFile(file,{ encoding: "utf-8" })    
} 


/**
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function translate(ctx) {
    const { langDir } = ctx 

    const tasks = logsets.tasklist({ width:80,grouped:true}) 
    const translateDir = path.join(langDir,"translates")

    const files = await fastGlob("*.json",{
        cwd: translateDir,
        absolute: true
    })

    logsets.header(t("准备翻译{}个文件"),files.length)
    
    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            const task = tasks.add("翻译{}",relFile)        
            
            await translateFile(file,ctx)
 
            tasks.complete()
        }catch(e){
            tasks.error(e)
            logsets.log(e.stack)
        }
    }   
}

module.exports = {
    translate
}