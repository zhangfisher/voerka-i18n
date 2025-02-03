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
        .option('-p, --provider <value>', t('在线翻译服务提供者名称或翻译脚本文件'), {default:'baidu'})
        .option('-m, --max-package-size <value>', t('将多个文本合并提交的最大包字节数'), {default:200})
        .option('--api-url [url]', t('API URL'),{default:"http://api.fanyi.baidu.com/api/trans/vip/translate"})
        .option('--api-id [id]', t('API ID'))
        .option('--api-key [key]', t('API密钥'))
        .option('--api [name]', t('API服务名称,声明在languages/api.json中'),{default:'baidu'})
        .option('-q, --qps <value>', t('翻译速度限制,即每秒可调用的API次数'), {default:1})  
        .action(async (options) => {          
            const ctx = await getProjectContext(options);   

            if(!ctx.appid || !ctx.appkey){                
                logsets.log(t("缺少{},{}参数"),"--appid","--appkey");
                return
            }
            await translate(ctx);
        });
    return translateCommand;
};
