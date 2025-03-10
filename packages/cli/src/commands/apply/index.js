/**
 * 
 * 
 * > voerkai18n apply vue2
 * > voerkai18n apply react
 * > voerkai18n apply svelte
 * > voerkai18n apply nextjs
 * > voerkai18n apply vue
 * > voerkai18n apply uniapp
 * > voerkai18n apply openinula
 * > voerkai18n apply lynx
 * 
 */

const { MixCommand } = require("mixcli");
const { t } = require("../../i18n"); 
const { getProjectContext } = require("@voerkai18n/utils");
const logsets = require("logsets");

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = () => {

    const applyCommand = new MixCommand("apply");  

    applyCommand
        .description(t("配置vue/react/nextjs/uniapp等支持"))
        .action(async (options) => {
            
        });
    return applyCommand

};
