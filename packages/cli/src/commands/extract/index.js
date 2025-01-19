const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const extractor = require("./extractor");

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli) => {
    const extractCommand = new MixCommand("extract");

    extractCommand
        .disablePrompts()
        .description(t("提取要翻译的文本"))
        .option("-m, --mode [value]", t("更新模式,取值sync,overwrite,merge"),{
            default:"sync",
            choices:["sync","overwrite","merge"]
        })
        .option("-p, --patterns [patterns...]", t("文件匹配规则"))
        .action(async (options) => {
            const opts = Object.assign({
                mode          : "sync" 
            }, options);

            await extractor(opts);            
        });
    return extractCommand;
};
