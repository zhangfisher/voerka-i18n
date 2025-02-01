const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const { wrap } = require("./wrap");
const logsets = require("logsets");
const { getCliContext, getApi } = require("@voerkai18n/utils");

/**
 * @param {import('mixcli').MixCli} cli
*/
module.exports = (cli) => {
    const wrapCommand = new MixCommand("wrap");

    wrapCommand
        .disablePrompts()
        .description(t("扫描源代码并自动应用翻译函数t"))
        .disablePrompts()
        .option("-p, --patterns <patterns...>", t("扫描匹配规则"),{require:true}) 
        .option("-o, --output [path]", t("输出目录，默认是直接修改原文件"))
        .option("--api-url [value]", t("AI大模型API地址"))
        .option("--api-key [value]", t("AI大模型API密钥"))
        .option("--api-model [value]", t("AI大模型"))        
        .option("--api [value]", t("languages/apis.json中预设AI服务"))        
        .action(async (options) => {
            if(!options.patterns){
                logsets.log(t("使用{}提供扫描匹配规则,例如：{}"),"-p, --patterns","-p ./src/**/*.{js,ts,tsx}")
                return
            }                
            const settings = await getCliContext(options);             
            const api = getApi(options.api,{                
                apiUrl      : options.apiUrl,
                apiKey      : options.apiKey,
                model    : options.apiModel
            }); 
            settings.api = api;
            if(!api || (api && (!api.apiKey || !api.apiUrl || !api.model))){
                logsets.header(t("此命令使用AI对代码进行分析和自动应用t函数,需要提供访问AI大模型的API地址、密钥以及模型名称"));
                logsets.log(t(" - 通过{},{},{}参数提供"),"--api-url","--api-key","--api-model");
                logsets.log(t(" - 或者在<{}>中声明，然后通过{}参数提供"), settings.langRelDir+"/.apis.json","--api" )
                return
            }
            await wrap(settings);
        });
    return wrapCommand;
};
