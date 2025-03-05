const fs = require("node:fs") 
const path = require("node:path")
const glob = require("fast-glob")
const { t } = require("../../i18n");
const { writeFile } = require('flex-tools/fs/nodefs');
const htmlParser = require("node-html-parser")
const { translateMultiLineMessage } = require("./translate");
const { getDir } = require("@voerkai18n/utils");

async function translateFileParagraphs(file){

    const { defaultLanguage,languages,language,tasks,typescript:isTypeScript,moduleType } = this
    
    const paragraph = await readFile(file,{ encoding: "utf-8" })
    const paragraphDoc = htmlParser.parse(paragraph,{comment:true})
    const defaultLangParagraphEle = paragraphDoc.querySelector(`div[language="${defaultLanguage}"]`) 
    const codeFileExtName = isTypeScript ? ".ts" : ".js"
    
    const lngs = language ? [{name:language}] : languages

    for(let lng of lngs ){
        if(lng.name === defaultLanguage) continue
        let task
        try{
            task = tasks.add(t("翻译 {} -> {}"),[defaultLanguage,lng.name])
            this.task = task
            const langParagraphEle = paragraphDoc.querySelector(`div[language=${lng.name}]`)
            if(!langParagraphEle){
                paragraphDoc.appendChild(`\n<div language="${lng.name}">${defaultLangParagraphEle && defaultLangParagraphEle.innerHTML}</div>`)
            }
            
            if(langParagraphEle.getAttribute("done")) continue

            const messages = langParagraphEle.innerHTML
            const [msgs,count] = await translateMultiLineMessage.call(this,messages.split("\n"),defaultLanguage,lng.name)
            if(count>0){
                langParagraphEle.innerHTML = msgs
                langParagraphEle.setAttribute("done",true)
                task.complete()                    
            }else{
                task.skip()
            }

            const targetDir = getDir(path.join(this.langDir,"paragraphs",lng.name))
            const exportCode = isTypeScript || moduleType=='esm' ? 'export default ' : 'module.exports = '
            const output = `${exportCode}\`${paragraphDoc.innerHTML}\``
            await writeFile(path.join(targetDir,path.basename(file),codeFileExtName),output)

        }catch(e){
            task.error(e)
        }
    } 

    await writeFile(file,paragraphDoc.innerHTML)

}



/**
 * 
 * 翻译段落
 *  
 */
async function translateParagraphs(){
    const { langDir } = this

    const paragraphsDir = getDir(path.join(langDir,"translates","paragraphs")) 

    const files = await glob(["*.html"],{
        cwd     : paragraphsDir,
        absolute: true
    })


    for(let file of files){
        const relFile= path.relative(process.cwd(),file)        
        tasks.addGroup(t("翻译{}"),relFile)            
        await translateFileParagraphs.call(file)        
    }   
    
}

module.exports = {
    translateParagraphs
}