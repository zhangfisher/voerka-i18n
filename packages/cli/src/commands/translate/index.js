const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const { translate } = require("./translate");
const logsets = require("logsets");
const { getProjectContext } = require("@voerkai18n/utils");


/**
 * @param {import('mixcli').MixCli} cli
*/
module.exports = () => {
    const translateCommand = new MixCommand("translate");

    translateCommand
        .disablePrompts()
        .description(t("执行自动翻译"))
        .disablePrompts()
        .option("--prompt [value]", t("languages/prompts文件夹里的提示模板文件名称"),{default:"translate"})
        .option("--api-url [value]", t("AI大模型API地址"))
        .option("--api-key [value]", t("AI大模型API密钥"))
        .option("--api-model [value]", t("AI大模型"))        
        .option("--api [value]", t("languages/api.json中预设AI服务"))        
        .action(async (options) => {          
            const ctx = await getProjectContext(options);       
            const api = ctx.api = ctx.getApi(options.api,{                
                apiUrl      : options.apiUrl,
                apiKey      : options.apiKey,
                model    : options.apiModel
            });  

            if(!api || (api && (!api.apiKey || !api.apiUrl || !api.model))){
                logsets.header(t("此命令使用AI对代码进行分析和自动应用t函数,需要提供访问AI大模型的API地址、密钥以及模型名称"));
                logsets.log(t(" - 通过{},{},{}参数提供"),"--api-url","--api-key","--api-model");
                logsets.log(t(" - 或者在<{}>中声明，然后通过{}参数提供"), ctx.langRelDir + "/api.json","--api" )
                return
            }
            await translate(ctx);
        });
    return translateCommand;
};
