const { MixCommand } = require("mixcli");
const { t } = require("../../i18n"); 
const { getProjectContext } = require("@voerkai18n/utils");
const logsets = require("logsets");

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = () => {

    const inspectCommand = new MixCommand("inspect");  

    inspectCommand
        .description(t("检查VoerkaI18n配置"))
        .action(async () => {
            const projectContext = await getProjectContext();
            logsets.format(JSON.stringify(projectContext, null, 4));   
        });
    return inspectCommand;

};
