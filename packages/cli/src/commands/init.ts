import { MixCli, MixCommand } from 'mixcli' 
import  allTags, { BCP47LanguageTags } from "bcp47-language-tags"
import { getPackageRootPath } from 'flex-tools/package/getPackageRootPath'
import path from "node:path"
import fs from "node:fs"

function getPrimaryLanguages(){
    // @ts-ignore
    const osLang = global.OSLanguage || 'en-US' 
    // @ts-ignore
    const primaryLangs = (allTags[osLang] || allTags['en-US'])  as BCP47LanguageTags 
    return Object.values(primaryLangs).filter(lang=>lang.primary)
        .map(lang=>({ 
            title: lang.tag + "\t" + lang.name ,
            value: lang.tag,
            selected: ['zh-CN','en-US'].includes(lang.tag) 
        }))
}
function getSelectedLanguages(seelctedTags:string[]){
    const primaryLangs = getPrimaryLanguages()
    const selectedLangs = primaryLangs.filter(lang=>seelctedTags.includes(lang.value))
    return selectedLangs
}


function getDefaultLanguageDir(){
    const packageRoot = getPackageRootPath() || "."
    const srcDir = path.join(packageRoot,"src")
    if(fs.existsSync(srcDir)){
        return srcDir
    }
    return path.join(packageRoot,"languages")
}


export default (cli:MixCli)=>{                
    const initCommand = new MixCommand("init");
    initCommand
        .description("初始化VoerkaI18n支持")         
        .option("-d, --dir [name]", "语言目录",{
            default:"./src/languages"
        })
        .option("--library", "是否开发库")
        .option("-l, --languags <tags...>", "选择支持的语言",{
            prompt:{
                type   : "multiselect", 
                min    : 2,
                choices: getPrimaryLanguages() 
            }
        })
        .option("--defaultLanguage <tag>", "默认语言",{
            prompt:{
                type   : "select", 
                initial : (answer:string[],answers:Record<string,any>)=>{
                    return answers.languags[0].value
                },
                choices: (answer:string[],answers:Record<string,any>)=>{                    
                    return getSelectedLanguages(answer)
                },
            }
        })
        .option("--activeLanguage <tag>", "激活语言",{
            prompt:{
                type   : "select", 
                initial : (answer:string[],answers:Record<string,any>)=>{
                    return answers
                },
                choices: (answer:string[],answers:Record<string,any>)=>{                    
                    return getSelectedLanguages(answers.language)
                },
            }
        })
        .action((options)=>{            
            console.log("Run init:",JSON.stringify(options))
        })

    return initCommand
}