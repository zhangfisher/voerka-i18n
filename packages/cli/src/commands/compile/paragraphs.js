/**
 * 
 * 编译文本信息
 * 
 */


const { t } = require("../../i18n"); 
const path = require("node:path"); 
const glob = require("fast-glob"); 
const { readFile,writeFile } = require("flex-tools/fs/nodefs");
const { getDir } = require("@voerkai18n/utils");
const htmlParser = require("node-html-parser")


async function compileParagraphFile(file){
    const paragraphId = path.basename(file,path.extname(file))

    const { langDir,typescript:isTypeScript,moduleType,languages } = this
    const paragraph = await readFile(file,{ encoding: "utf-8" })
    const paragraphDoc = htmlParser.parse(paragraph,{comment:true})
    const codeFileExtName = isTypeScript ? ".ts" : ".js"

    for(let language of languages){
        const langParagraphEle = paragraphDoc.querySelector(`div[language="${language.name}"]`)
        const langPhtDir = getDir(path.join(langDir,"paragraphs",language.name))
        const exportCode = isTypeScript || moduleType=='esm' ? 'export default ' : 'module.exports = '
        const outputCode  = `${exportCode}\`${langParagraphEle.innerHTML}\``
        await writeFile(path.join(langPhtDir,`${paragraphId}${codeFileExtName}`),outputCode)
    }
}

async function generateLanguageParagraphsIndex(files){
    const { typescript:isTypeScript,moduleType,languages } = this
    const codeFileExtName = isTypeScript ? ".ts" : ".js"    
    for(let lng of languages ){
        const indexDir =  getDir(path.join(this.langDir,"paragraphs",lng.name))
        const indexFile = path.join(indexDir,`index${codeFileExtName}`)
        const exportCode = isTypeScript || moduleType=='esm' ? 'export default ' : 'module.exports = '
        const output = []
        for(let file of files){
            const paragraphId = path.basename(file,path.extname(file))
            output.push(isTypeScript || moduleType=='esm' ?
                `\t'${paragraphId}' : () => import('./${paragraphId}')`
                : `\t'${paragraphId}' : () => require('./${paragraphId}')`)
        }
        await writeFile(indexFile,`${exportCode}{\n${output.join(",\n")}\n}`)
    }
}
async function generateParagraphsIndex(){
    const { languages,typescript:isTypeScript,moduleType } = this
    const codeFileExtName = isTypeScript ? ".ts" : ".js"    
    
    const indexDir =  getDir(path.join(this.langDir,"paragraphs"))
    const indexFile = path.join(indexDir,`index${codeFileExtName}`)
    const exportCode = isTypeScript || moduleType=='esm' ? 'export default ' : 'module.exports = ' 

    const importCode = languages.map(lang=>{
        return  isTypeScript || moduleType=='esm' ?
             `import ${lang.name.replaceAll('-',"")} from './${lang.name}'`
             :`const ${lang.name.replaceAll('-',"")} = require('./${lang.name}')`
    }).join("\n")

    const indexCode = languages.map(lang=>{
        return  `\t'${lang.name}' : ${lang.name.replaceAll('-',"")}`
    }).join(",\n")


    await writeFile(indexFile,`${importCode}\n\n${exportCode}{\n${indexCode}\n}`)


}     
/**
 * 编译语言信息
 * @param {*} ctx 
 */
async function compileParagraphs(){
    const { tasks,langDir } = this
    
    const paragraphsDir = getDir(path.join(langDir,"translates","paragraphs"))

    const files = await glob(["*.html"],{
        cwd     : paragraphsDir,
        absolute: true
    })

    tasks.addGroup(t("编译段落："))

    if(files.length===0){
        tasks.addMemo(t("没有找到段落文件"))
        return
    }

    for(let file of files){
        try{
            tasks.add([t("编译段落: {}"),path.relative(process.cwd(),file)])
            await compileParagraphFile.call(this,file)
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }
    await generateLanguageParagraphsIndex.call(this,files)
    await generateParagraphsIndex.call(this)
    await generateParagraphsIndex.call(this)
}

module.exports = {
    compileParagraphs
}