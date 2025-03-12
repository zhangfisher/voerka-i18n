const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const { wrap, applyWrap } = require("./wrap");
const logsets = require("logsets");
const { getProjectContext } = require("@voerkai18n/utils");


/**
 * @param {import('mixcli').MixCli} cli
*/
module.exports = () => {
    const wrapCommand = new MixCommand("wrap");

    wrapCommand
        .disablePrompts()
        .description(t("扫描源代码并为需要翻译的内容自动包裹t翻译函数"))
        .disablePrompts()
        .option("-p, --patterns <patterns...>", t("扫描匹配规则"),{ default:["./src/**/*.{js,ts,tsx,jsx}"] }) 
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

            if(options.apply) options.patterns = ["./src/**/*.wrapped.*"]
            const ctx = await getProjectContext(options);
 
            if(!options.apply && Array.isArray(ctx.patterns)){
                ctx.patterns.push("!**/*.wrapped.*")
            }

            const api = ctx.api
            if(!api || (api && (!api.key || !api.url || !api.model))){
                logsets.header(t("此命令使用AI对代码进行分析和自动应用t函数,需要提供访问AI大模型的API地址、密钥以及模型名称"));
                logsets.log(t(" - 通过{},{},{}参数提供"),"--api-url","--api-key","--api-model");
                logsets.log(t(" - 或者在<{}>中声明,然后通过{}参数提供"), ctx.langRelDir + "/api.json","--api" )
                return
            }

            
            if(options.apply){
                await applyWrap(ctx);
            }else{
                await wrap(ctx);
            } 

        });
    return wrapCommand;
};
