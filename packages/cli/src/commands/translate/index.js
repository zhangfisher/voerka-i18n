const { MixCommand } = require("mixcli");
const path = require("node:path");
const { t } = require("../../i18n"); 
const logsets = require("logsets");
const { getProjectContext } = require("@voerkai18n/utils");
const { translateMessages } = require("./messages");
const { translateParagraphs } = require("./paragraphs");


/**
 * @param {import('mixcli').MixCli} cli
*/
module.exports = () => {
    const translateCommand = new MixCommand("translate");

    translateCommand
        .disablePrompts()
        .description(t("执行自动翻译"))
        .disablePrompts()
        .option('-m, --mode <value>', t('翻译模式,取值auto=仅翻译未翻译的,full=全部翻译'), {default:'auto'})
        .option('-l, --language <name>', t('只翻译指定的语言'))        
        .option('-f, --file <name>', t('只翻译指定的文件,如messages/default.json'))       
        .option('-p, --provider <value>', t('在线翻译服务提供者名称或翻译脚本文,取值:ai | baidu'), {default:'ai'})
        .option('--max-package-size <value>', t('将多个文本合并提交的最大包字节数'), {default:150})
        .option('--api-url <url>',t('API URL'))
        .option('--api-id <id>', t('API ID'))
        .option('--api-model <name>', t('AI模型名称'))
        .option('--api-key <key>', t('API密钥'))
        .option('--api <name>', t('API服务名称,声明在languages/api.json中'),{default:"baidu"})
        .option('-q, --qps <value>', t('翻译速度限制,即每秒可调用的API次数'), {default:0})   
        .action(async (options) => {          
            const ctx = await getProjectContext(options);   
            if(!ctx.api){ 
                logsets.header(t("需要指定翻译API服务"));
                logsets.log(t("- 通过{},{},{}参数指定"),"--api-url","--api-id","--api-key");
                logsets.log(t("- 在{}文件中配置翻译API服务参数,详见文档"),"languages/api.json");                
                return
            }
            const { langDir } = ctx 
            const tasks = logsets.tasklist({ width:80,grouped:true}) 
            ctx.tasks = tasks
            tasks.addGroup(t("准备翻译"))
            tasks.addMemo(t("翻译模式：{}"),ctx.mode)
            tasks.addMemo(t("语言目录：{}"),path.relative(process.cwd(),langDir))
            tasks.addMemo(t("翻译服务：{}"),ctx.provider)
            tasks.addMemo(t("翻译速度：{}"),ctx.qps)
            tasks.addMemo(t("翻译语言：{}"),ctx.language ? ctx.language : ctx.languages.map(lng=>lng.name).join(", "))
            tasks.addMemo(t("请求数据包限制: {}" ),ctx.maxPackageSize)
            
            ctx.prompt="translate-messages"
            await translateMessages.call(ctx)
            
            //  翻译段落时,将maxPackageSize设置为0,以便每个段落都是一个请求            
            ctx.maxPackageSize = 0 
            ctx.prompt="translate-paragraphs"
            await translateParagraphs.call(ctx)
        
            tasks.done()
        });
    return translateCommand;
};
