/**
 * 测试demp app的语言运行环境
 * 
 * > pnpm test:app
 *  
 *  执行本测试用例时需要确保packages/apps/test文件夹没有被占用
 * 
 */ 

const path = require("path");
const fs = require("fs-extra");
const shelljs = require("shelljs");
const os = require("os")



// 演示的项目名称


const APP_FOLDER = path.join(__dirname, "../packages/apps/test");
const LANGUAGE_FOLDER = path.join(APP_FOLDER, "languages");
const TRANSLATES_FOLDER = path.join(LANGUAGE_FOLDER, "translates");

let SUPPORTED_LANGUAGES = ["zh", "en","de","jp","fr"];
let DEFAULT_LANGUAGE = "zh"
let ACTIVE_LANGUAGE = "zh"

const CN_TEXTS = ["一","二","三","四","五"];
const EN_TEXTS = ["One","Two","Three","Four","Five"];

function createTestApp(){
    if(fs.existsSync(APP_FOLDER)) resetTestApp()
    fs.mkdirSync(APP_FOLDER);
    // 创建package.json
    const pkgFile = path.join(APP_FOLDER, "package.json");
    fs.writeFileSync(pkgFile, JSON.stringify({
        name: "@voerkai18n/testapp",        
        main:"./index.js",
        scripts: {
            "release": "pnpm autopublish"
        }
    },null,4))
    // 创建index.js
    const indexFile = path.join(APP_FOLDER, "index.js");
    fs.writeFileSync(indexFile, `
const { t,i18nScope } = require("./languages/index.js");
let cn_messages, en_messages
async function output(){
    cn_messages =  t("一")+t("二")+t("三")+t("四")+t("五")    
    console.log(cn_messages)
    await i18nScope.change("en")
    en_messages = t("一")+t("二")+t("三")+t("四")+t("五")    
    console.log(en_messages)
}
output().then(()=>{})
module.exports = {
    change:async (lang)=> await i18nScope.change(lang),
    getMessages:()=>{
        return t("一")+t("二")+t("三")+t("四")+t("五")    
    }
}
`)
}

function resetTestApp(){
    fs.removeSync(APP_FOLDER);
}

beforeAll(() => {
    shelljs.exec("pnpm update -g @voerkai18n/utils")
    shelljs.exec("pnpm update -g @voerkai18n/runtime ")
    shelljs.exec("pnpm update -g @voerkai18n/cli ")
    createTestApp()
    shelljs.cd(APP_FOLDER);  
})


test("工程目录国际化",done=>{
    let { code } = shelljs.exec(`voerkai18n init -lngs ${SUPPORTED_LANGUAGES.join(" ")} -r -a ${ACTIVE_LANGUAGE} -d ${DEFAULT_LANGUAGE}`,{silent:true})
    expect(code).toBe(0)
    expect(fs.existsSync(LANGUAGE_FOLDER)).toBe(true)

    const settingsFile = path.join(LANGUAGE_FOLDER, "settings.json");
    expect(fs.existsSync(settingsFile)).toBe(true)

    const langSettings = fs.readJSONSync(settingsFile);
    expect(langSettings.languages.map(lng=>lng.name).join(",")).toEqual(SUPPORTED_LANGUAGES.join(","));
    expect(langSettings.defaultLanguage).toEqual(DEFAULT_LANGUAGE);
    expect(langSettings.activeLanguage).toEqual(ACTIVE_LANGUAGE);
    done()
})

test("提取文本",(done) =>{
    
    let code = shelljs.exec(`voerkai18n extract`).code;
    expect(code).toEqual(0);

    // 翻译文件夹
    expect(fs.existsSync(TRANSLATES_FOLDER)).toBe(true);
    // 翻译文件
    const msgFile = path.join(TRANSLATES_FOLDER,"default.json")
    expect(fs.existsSync(msgFile)).toBe(true);
    let messages = fs.readJSONSync(msgFile)
    messages = fs.readJSONSync(msgFile)

    expect(CN_TEXTS.every(text=>text in messages)).toBeTruthy();

    for(let [text,lngs] of Object.entries(messages)){
        expect(SUPPORTED_LANGUAGES.every(lng=>lng===DEFAULT_LANGUAGE || (lng in lngs))).toBeTruthy();
    }

    done()
})


test("编译多语言",(done) =>{
    // 模拟翻译英文文件
    const msgFile = path.join(TRANSLATES_FOLDER,"default.json")
    let messages = fs.readJSONSync(msgFile)
    messages["一"]["en"] = "One"
    messages["二"]["en"] = "Two"
    messages["三"]["en"] = "Three"
    messages["四"]["en"] = "Four"
    messages["五"]["en"] = "Five"
    fs.writeFileSync(msgFile,JSON.stringify(messages,null,2))

    const code = shelljs.exec(`voerkai18n compile -m cjs`).code    
    expect(code).toEqual(0);
    // 是否生成所有的文件
    const filesIsGenerated = ["index.js","idMap.js","formatters.js","runtime.js"].every(filename=>fs.existsSync(path.join(LANGUAGE_FOLDER,filename)));
    expect(filesIsGenerated).toBeTruthy();
    expect(SUPPORTED_LANGUAGES.every(lng=>fs.existsSync(path.join(LANGUAGE_FOLDER,`${lng}.js`)))).toBe(true);
    done()
})


test("切换语言",async () =>{
    const { change,getMessages } = require(path.join(APP_FOLDER,"index.js"))
    expect(getMessages()).toEqual(CN_TEXTS.join(""));
    await change("en");
    expect(getMessages()).toEqual(EN_TEXTS.join(""));
})



