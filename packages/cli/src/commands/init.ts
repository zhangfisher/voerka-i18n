import { MixCli, MixCommand } from 'mixcli'
import { tags } from "bcp47-language-tags/en"

function getLanguageList(){
    return tags.filter(tag=>tag.default).map(tag=>({value:tag.tag,title:tag.name}))
}

export default (cli:MixCli)=>{                
    const initCommand = new MixCommand("init");
    initCommand
        .description("初始化VoerkaI18n支持")         
        .option("-d, --dir <name>", "语言目录",{default:"./src/languages",prompt:true})
        .option("-l, --support-languags [...type]", "支持的语言列表",{
            prompt:{
                type: "multiselect", 
                choices:["a","b","c"]
            }
        })
        .action((options)=>{            
            console.log("Run init:",JSON.stringify(options))
        })
    return initCommand
}