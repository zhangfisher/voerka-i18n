const fs = require("node:fs") 
const path = require("node:path")
const glob = require("fast-glob")
const { t } = require("../../i18n");
const { readFile, writeFile } = require('flex-tools/fs/nodefs');
const htmlParser = require("node-html-parser")
const { translateParagraph } = require("./translate");
const { getDir } = require("@voerkai18n/utils");

async function translateFileParagraphs(file){

    const { defaultLanguage,languages,language,tasks,typescript:isTypeScript,moduleType } = this
    
    const paragraph = await readFile(file,{ encoding: "utf-8" })
    const paragraphDoc = htmlParser.parse(paragraph,{comment:true})
    const defaultLangParagraphEle = paragraphDoc.querySelector(`div[language="${defaultLanguage}"]`) 
    const codeFileExtName = isTypeScript ? ".ts" : ".js"
    
    const lngs = language ? [{name:language}] : languages
    let updatedCount = 0
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
            
            if(langParagraphEle.getAttribute("done")) {
                task.skip()
                continue
            }
 
            const translated = await translateParagraph.call(this, langParagraphEle.innerHTML,defaultLanguage,lng.name)
            if(translated){
                langParagraphEle.innerHTML = translated
                langParagraphEle.setAttribute("done",true)
                task.complete()                    
                updatedCount++
            }else{
                task.skip()
            }
     
        }catch(e){
            task.error(e)
        }
    } 
    if(updatedCount>0){
        await writeFile(file,paragraphDoc.innerHTML)
    }
}

/**
 * 
 * 翻译段落
 *  
 */
async function translateParagraphs(){
    const { langDir,tasks } = this

    const paragraphsDir = getDir(path.join(langDir,"translates","paragraphs")) 

    const files = await glob(["*.html"],{
        cwd     : paragraphsDir,
        absolute: true
    })


    for(let file of files){
        const relFile= path.relative(process.cwd(),file)        
        tasks.addGroup(t("翻译{}"),relFile)            
        await translateFileParagraphs.call(this,file)        
    }    
 
}

module.exports = {
    translateParagraphs
}