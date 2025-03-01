const { MixCommand } = require("mixcli");
const { t } = require("../../i18n"); 
const { getProjectContext } = require("@voerkai18n/utils");
const logsets = require("logsets");

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = () => {

    const addLanguageCommand = new MixCommand("add-language");  

    addLanguageCommand
        .description(t("增加语言"))
        .action(async () => {
            const projectContext = await getProjectContext();
            const settings = projectContext.settings;

        });
    return addLanguageCommand;

};
