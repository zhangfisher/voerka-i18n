const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const { wrap } = require("./wrap");
const logsets = require("logsets");
const { getProjectContext } = require("@voerkai18n/utils");


/**
 * @param {import('mixcli').MixCli} cli
*/
module.exports = () => {
    const wrapCommand = new MixCommand("wrap");

    wrapCommand
        .disablePrompts()
        .description(t("扫描源代码并自动应用翻译函数t"))
        .disablePrompts()
        .option("-p, --patterns <patterns...>", t("扫描匹配规则"),{default:"-p ./src/**/*.{js,ts,tsx,jsx}"}) 
        .option("--no-debug", t("关闭调试模式,不会修改原文件,输出到.wrapped文件"),{default:true})  
        .option("--apply", t("应用包装修改到源文件"),{default:false})  
        .option("--prompt [value]", t("languages/prompts文件夹里的提示模板文件名称"),{default:"wrap"})
        .option("--api-url [value]", t("AI大模型API地址"))
        .option("--api-key [value]", t("AI大模型API密钥"))
        .option("--api-model [value]", t("AI大模型"))        
        .option("--api [value]", t("languages/api.json中预设AI服务"))        
        .action(async (options) => {
            if(!options.patterns){
                logsets.log(t("使用{}提供扫描匹配规则,例如：{}"),"-p, --patterns","-p ./src/**/*.{js,ts,tsx,jsx}")
                return
            }                
            const tasks = logsets.tasklist({ width:80 })

            const ctx = await getProjectContext(options);       
            const api = ctx.api = ctx.getApi(options.api,{                
                apiUrl      : options.apiUrl,
                apiKey      : options.apiKey,
                model    : options.apiModel
            }); 
            if(Array.isArray(ctx.patterns)){
                ctx.patterns.push("!**/*.wrapped.*")
            }

            if(!api || (api && (!api.apiKey || !api.apiUrl || !api.model))){
                logsets.header(t("此命令使用AI对代码进行分析和自动应用t函数,需要提供访问AI大模型的API地址、密钥以及模型名称"));
                logsets.log(t(" - 通过{},{},{}参数提供"),"--api-url","--api-key","--api-model");
                logsets.log(t(" - 或者在<{}>中声明，然后通过{}参数提供"), ctx.langRelDir + "/api.json","--api" )
                return
            }
            await wrap(ctx,tasks);

            if(!options.apply){
                tasks.addGroup(t("注意："));
                tasks.addMemo(t("包装修改保存到同名的.wrapped文件,不会修改原文件"));
                tasks.addMemo(t("使用{}命令应用到原文件"),"voerkai18n wrap --apply");
            }
            tasks.done()

        });
    return wrapCommand;
};
