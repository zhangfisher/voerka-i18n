const { t } = require("../../i18n");
const fs = require("node:fs");
const path = require("node:path"); 
const { readFile, writeFile } = require("flex-tools/fs/nodefs");
const htmlParser = require("node-html-parser");
const { indentString } = require("@voerkai18n/utils")
 


async function overwriteParagraph(paragraph){    
    const ctx = this
    const { languages,paragraphFile } = ctx
    const results = []
    results.push(`<div class="paragraph" id="${paragraph.id}" scope="${paragraph.scope}" file="${paragraph.file}" rang="${paragraph.rang.start}-${paragraph.rang.end}" />`)    
    languages.forEach(lng=>{
        results.push(`<div language="${lng.name}">\n${paragraph.message}\n</div>`)
    })
    await writeFile(paragraphFile,results.join('\n'))
}


async function syncParagraph(paragraph){    
    const ctx = this 
    const { languages,paragraphFile } = ctx

    const oldParagraph = fs.existsSync(paragraphFile) ? await readFile(paragraphFile) : ''
    const oldParagraphObj = htmlParser.parse(oldParagraph,{comment:true})
    // 如果没有注释，添加注释
    if(!/<!--[\s\S]*?id:[\s\S]*?scope:[\s\S]*?[\s\S]*?-->/gm.test(oldParagraphObj.innerHTML)){
        oldParagraphObj.prepend(indentString(`<!-- 
            id:    ${paragraph.id || ''} 
            scope: ${paragraph.scope || ''} 
            file:  ${path.relative(process.cwd(),paragraph.file)} 
            rang:  ${paragraph.rang.start}-${paragraph.rang.end} 
        -->\n`,8))
    }    

    languages.forEach(lng=>{
        const paragraphNode = oldParagraphObj.querySelector(`div[language="${lng.name}"]`)
        if(paragraphNode){  // 已经存在             
            // done代表已经翻译过了
            const isDone = paragraphNode.getAttribute('done') 
            if(paragraphNode.innerHTML != paragraph.message || isDone) return            
            paragraphNode.innerHTML = paragraph.message
        }else{                    // 不存在
            oldParagraphObj.appendChild(`\n<div language="${lng.name}">${paragraph.message}</div>`)
        }
    })
    await writeFile(paragraphFile,oldParagraphObj.innerHTML)

}
/**
 * 
 *     type ParagraphNode = {
 *         id?        : string
 *         message   : string
 *         vars?      : string
 *         scope?     : string
 *         options?   : string
 *         rang     : { start: string, end: string } 
 *         file?     : string
 }
  * @param {ParagraphNode[]} paragraphs
 */
async function updateParagraphs(paragraphs,ctx){    
    const mode = ctx.mode || 'sync' 
    for(let paragraph of paragraphs){
        const paragraphFile = path.join(ctx.getTranslateParagraphsDir(),`${paragraph.id}.html`)
        ctx.paragraphFile = paragraphFile
        const isExisted = fs.existsSync(paragraphFile)
        if(isExisted && mode === 'overwrite') {
            await overwriteParagraph.call(ctx,paragraph)
        }else{
            await syncParagraph.call(ctx,paragraph)
        }
    }
}

module.exports = {
    updateParagraphs 
}

