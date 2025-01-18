const { MixCommand } = require("mixcli");
const { t } = require("../../i18n");
const { getLanguageDir } = require("@voerkai18n/utils")
const { isTypeScriptPackage } = require("flex-tools/package/isTypeScriptPackage");
const { getBcp47LanguageApi } = require("@voerkai18n/utils");
const initializer = require("./initializer");
/**
 * 获取主要语言列表
 * 根据操作系统语言或默认的 "en-US"，从 allTags 中获取对应的主要语言信息
 * 过滤出主要语言，并将其标签、名称和处理后的选中状态组成对象数组返回
 * @returns {Array} 主要语言的对象数组，每个对象包含 title、value 和 selected 属性
 */
function getPrimaryLanguages() {
    const osLang = global.OSLanguage || "en-US";
    const langApi = getBcp47LanguageApi(osLang)
    const langs = langApi.getTags()
    return Object.values(langs)
        .filter((lang) => lang.primary)
        .map((lang) => ({
            title: lang.tag + "\t" + lang.name,
            value: lang.tag,
            selected: ["zh-CN", "en-US"].includes(lang.tag),
        }));
}

/**
 * 根据选中的标签获取所选语言列表。
 *
 * @param {Array} seelctedTags - 选中的语言标签数组。
 * @returns {Array} 返回一个包含符合选中标签的主要语言的数组。如果没有提供标签，则返回所有主要语言。
 *
 * @example
 * // 如果选中标签为 ['en', 'zh']
 * // getSelectedLanguages(['en', 'zh']);
 * // 返回包含英语和中文的主要语言数组
 */
function getSelectedLanguages(seelctedTags) {
  const primaryLangs = getPrimaryLanguages();
  const selectedLangs = seelctedTags
    ? primaryLangs.filter((lang) => seelctedTags.includes(lang.value))
    : primaryLangs;
  return selectedLangs;
}
 

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli) => {

    const isTypeScript = isTypeScriptPackage();

    const initCommand = new MixCommand("init");

    initCommand
        .description(t("初始化VoerkaI18n支持"))
        .option("-r, --reset",t("重新初始化"),{default:false,prompt:false})
        .option("-d, --language-dir [path]", t("语言目录"), {
            default: getLanguageDir({autoCreate:false,absolute:false}),
            prompt : true,
        })
        .option("--library", t("是否开发库工程"))
        .option("-l, --languages <tags...>", t("选择支持的语言"), {
            prompt: {
                type   : "multiselect",
                min    : 2,
                choices: getPrimaryLanguages(),
            },
        })
        .option("--defaultLanguage <tag>", t("默认语言"), {
            prompt: {
                type: "select",
                initial: (_, answers) => {
                    return answers.languages[0].value;
                },
                choices: (answer) => {
                    return getSelectedLanguages(answer);
                },
            },
        })
        .option("--activeLanguage <tag>", t("激活语言"), {
            prompt: {
                type: "select",
                choices: (_, answers) => {
                    return getSelectedLanguages(answers.languages);
                },
            },
        })
        .option("-t, --typescript", t("启用Typescript"), {
            default: isTypeScript,
            prompt: true,
        })
        .option("-m, --module-type", t("模块类型"), {
            choices: ["esm", "cjs"],
            prompt: "select",
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
