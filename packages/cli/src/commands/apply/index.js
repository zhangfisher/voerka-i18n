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
const path = require("node:path");
const fs = require("node:fs");
const { t } = require("../../i18n"); 
const { getProjectContext,fetchJson } = require("@voerkai18n/utils");
const logsets = require("logsets");
const { installPackage } = require("flex-tools/package/installPackage");
const { packageIsInstalled } = require("flex-tools/package/packageIsInstalled");
const { copyFiles } = require("flex-tools/fs/copyFiles");

let frameworks = [
    { "name": "React", "package":"@voerkai18n/react" },
    { "name": "Vue 2", "package":"@voerkai18n/vue2" },
    { "name": "Vue 3", "package":"@voerkai18n/vue" },
    { "name": "Svelte", "package":"@voerkai18n/svelte" },
    { "name": "Nextjs", "package":"@voerkai18n/nextjs"}
]




/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = () => {

    const applyCommand = new MixCommand("apply");  

    applyCommand
        .description(t("配置vue/react/nextjs/uniapp等支持"))
        .enablePrompts()
        .initial(async () => {
            frameworks = await fetchJson([
                "https://github.com/zhangfisher/voerka-i18n/blob/3.0/integrations.json",
                "https://github.com/zhangfisher/voerka-i18n/blob/3.0/integrations.json"
            ],frameworks) 
        })        
        .option("-f, --framework [name]", t("指定框架名称"),{
            prompt: {
                type:'select',
                choices: () => frameworks.map(f=>({title:f.name,value:f.package}))
            }
        })
        .action(async (options) => {
          
            const { framework } = options
            console.log(framework)
            const tasks = logsets.tasklist(t("启用{}框架集成"),framework)
            try{
                tasks.add(t("安装{}依赖"),framework)
                if(await packageIsInstalled(framework)){
                    tasks.skip()
                }else{
                    await installPackage.call(this,framework)
                    tasks.complete()
                }                
            }catch(e){
                tasks.error(e)
            }

            try{
                tasks.add(t("配置框架支持"))
                const ctx = await getProjectContext()
                const { langDir,moduleType,typescript } = ctx
               
                const installDir = path.join(path.dirname(require.resolve(framework)),"install",typescript ? "ts" : "esm")
                
                if(!fs.existsSync(installSourceDir)){
                    throw new Error(t("框架{}不支持当前语言模式",framework))
                }else{
                    await copyFiles("**/*.*",langDir, { 
                        cwd      : installSourceDir,
                        overwrite: true,
                        vars     : ctx
                    }) 
                }                
                tasks.complete()
            }catch(e){
                tasks.error(e)
            }
            tasks.done()

        });
    return applyCommand

};
