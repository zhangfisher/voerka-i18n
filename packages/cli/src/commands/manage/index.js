const { MixCommand } = require("mixcli");
const { t } = require("../../i18n"); 
const { getProjectContext } = require("@voerkai18n/utils");
const logsets = require("logsets");

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = () => {

    const manageCommand = new MixCommand("manage");  
    manageCommand
        .description(t("管理控制台"))
        .action(async () => {
            console.log("TODO!")
        });
    return manageCommand

};
