const { MixCommand } = require("mixcli");
const { t } = require("../../i18n"); 
const { compile } = require("./compile"); 
const { getProjectContext } = require("@voerkai18n/utils");

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli) => {
    const compileCommand = new MixCommand("compile");

    compileCommand
        .disablePrompts()
        .description(t("编译语言包"))
        .disablePrompts()
        .option("-t, --typescript", t("启用typescript"))
        .option("-m, --module-type [values...]", t("模块类型,取值:cjs,esm"))
        .action(async (options) => {
            const ctx = await getProjectContext(options);    
            await compile(ctx);
        });
    return compileCommand;
};
