import { MixCli, MixCommand } from 'mixcli'


export default (cli:MixCli)=>{                
    const initCommand = new MixCommand("init");
    initCommand
        .description("初始化VoerkaI18n支持")         
        .option("-d, --dir <name>", "语言目录",{default:"./src/languages",prompt:true})
        .option("-l, --languages <type>", "支持的语言",{choices:()=>["vue","react","angular"]})
        .action((options)=>{            
            console.log("Run init:",options.type)
        })
    return initCommand
}