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
        .option('--mode', t('翻译模式,取值auto=仅翻译未翻译的,full=全部翻译'), {default:'auto'})
        .option('-l, --language <name>', t('只翻译指定的语言'))        
        .option('-p, --provider <value>', t('在线翻译服务提供者名称或翻译脚本文件'), {default:'baidu'})
        .option('-m, --max-package-size <value>', t('将多个文本合并提交的最大包字节数'), {default:200})
        .option('--api-url <url>',t('API URL'))
        .option('--api-id <id>', t('API ID'))
        .option('--api-model <name>', t('AI模型名称'))
        .option('--api-key <key>', t('API密钥'))
        .option('--api <name>', t('API服务名称,声明在languages/api.json中'),{default:"baidu"})
        .option('-q, --qps <value>', t('翻译速度限制,即每秒可调用的API次数'), {default:1})  
        .action(async (options) => {          
            const ctx = await getProjectContext(options);   
            if(!ctx.api){ 
                logsets.header(t("需要指定翻译API服务"));
                logsets.log(t("- 通过{},{},{}参数指定"),"--api-url","--api-id","--api-key");
                logsets.log(t("- 在{}文件中配置翻译API服务参数,详见文档"),"languages/api.json");                
                return
            }
            await translate(ctx);
        });
    return translateCommand;
};
