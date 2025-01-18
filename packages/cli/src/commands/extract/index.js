const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const { getLanguageDir } = require("@voerkai18n/utils")
const { isTypeScriptPackage } = require("flex-tools/package/isTypeScriptPackage");
const { getBcp47LanguageApi } = require("@voerkai18n/utils");
 

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli) => {

    const isTypeScript = isTypeScriptPackage();

    const extractCommand = new MixCommand("extract");

    extractCommand
        .description(t("提取要翻译的文本"))
        .option("-m, --mode [value]", t("更新模式"),{
            default:false,
            choices:["sync","overwrite","merge"],
            prompt:true
        })
        .action(async (options) => {
            const opts = Object.assign({
                reset          : false,
                moduleType     : "esm",
                library        : false,
                languages      : [],
                defaultLanguage: "zh-CN",
                activeLanguage : "zh-CN",
                typescript     : isTypeScript
            }, options);
            await initializer(opts);            
        });
    return initCommand;
};
