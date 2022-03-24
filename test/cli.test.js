/**
 * 测试demp app的语言运行环境
 */ 

const path = require("path");
const fs = require("fs-extra");
const shelljs = require("shelljs");
 
const APP_FOLDER = path.join(__dirname, "../demo/apps/app");
const LANGUAGE_FOLDER = path.join(APP_FOLDER, "languages");
const TRANSLATES_FOLDER = path.join(LANGUAGE_FOLDER, "translates");

const CLI_INDEX_FILE = path.join(__dirname, "../cli/index.js");

let SUPPORTED_LANGUAGES = ["cn", "en"];
let DEFAULT_LANGUAGE = "cn"
let ACTIVE_LANGUAGE = "cn"
let MODULE_TYPE = "module"



async function importModule(url,onlyDefault=true) {
    try{
        return require(url)
    }catch(e){
        const result = await import(`file:///${url}`)
        return onlyDefault ? result.default : result
    }
}

function createAppIndexFile(){
    fs.writeFileSync(path.join(APP_FOLDER, "index.js"), ` 
        t("a")
        t("b")
        t("c")
        t("d")
        t("e")    
    `)
}

// 重置演示应用
function resetDemoApp(){
    fs.removeSync(LANGUAGE_FOLDER)
}
// 清除提取结果
function clearExtractResults(){
    fs.emptyDirSync(path.join(LANGUAGE_FOLDER, "translates"))
}
// 清除编译结果
function clearCompileResults(){
    fs.removeSync(path.join(LANGUAGE_FOLDER, "package.json"))
    fs.removeSync(path.join(LANGUAGE_FOLDER, "index.js"))
    fs.removeSync(path.join(LANGUAGE_FOLDER, "idMap.js"))
    fs.removeSync(path.join(LANGUAGE_FOLDER, "formatters.js"))
    fs.removeSync(path.join(LANGUAGE_FOLDER, "cn.js"))
    fs.removeSync(path.join(LANGUAGE_FOLDER, "en.js"))
}

// 更新主工程的package.json文件
function updateProjectPackageJson(pkg={}){
    pkg = Object.assign({type:MODULE_TYPE}, pkg)
    fs.writeJsonSync(path.join(APP_FOLDER, "package.json"), pkg)
}

function initCommonjsApp(){
    shelljs.cd(APP_FOLDER);
    resetDemoApp()
    updateProjectPackageJson({type:"commonjs"})
    shelljs.exec(`node ${CLI_INDEX_FILE} init . -lngs ${SUPPORTED_LANGUAGES.join(" ")} -default ${DEFAULT_LANGUAGE} -active ${ACTIVE_LANGUAGE}`).code
}

function initESMApp(){
    shelljs.cd(APP_FOLDER);
    resetDemoApp()
    updateProjectPackageJson({type:"module"})
    shelljs.exec(`node ${CLI_INDEX_FILE} init . -lngs ${SUPPORTED_LANGUAGES.join(" ")} -default ${DEFAULT_LANGUAGE} -active ${ACTIVE_LANGUAGE}`).code
}

beforeAll(() => {
    resetDemoApp();
})

beforeEach(() => {
    shelljs.cd(APP_FOLDER);   
    updateProjectPackageJson({type:"module"})
    createAppIndexFile()
})

test("清空工程目录国际化",done=>{
    resetDemoApp();
    expect(fs.existsSync(LANGUAGE_FOLDER)).toBe(false);    
    done();
})


test("初始化工程(esm)",async () =>{
    let code = shelljs.exec(`node ${CLI_INDEX_FILE} init . -lngs ${SUPPORTED_LANGUAGES.join(" ")} -default ${DEFAULT_LANGUAGE} -active ${ACTIVE_LANGUAGE}`).code
    expect(code).toEqual(0);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"package.json"))).toBe(true);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"settings.js"))).toBe(true);
    expect(fs.readJSONSync(path.join(LANGUAGE_FOLDER,"package.json")).type || "commonjs").toEqual(MODULE_TYPE);
    const langSettings = await importModule(path.join(LANGUAGE_FOLDER,"settings.js"));

    expect(langSettings.languages.map(lng=>lng.name).join(",")).toEqual(SUPPORTED_LANGUAGES.join(","));
    expect(langSettings.defaultLanguage).toEqual(DEFAULT_LANGUAGE);
    expect(langSettings.activeLanguage).toEqual(ACTIVE_LANGUAGE);
})
test("初始化工程(cjs)",async () =>{
    updateProjectPackageJson({type:"commonjs"})
    let code = shelljs.exec(`node ${CLI_INDEX_FILE} init . -lngs ${SUPPORTED_LANGUAGES.join(" ")} -default ${DEFAULT_LANGUAGE} -active ${ACTIVE_LANGUAGE}`).code
    expect(code).toEqual(0);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"package.json"))).toBe(true);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"settings.js"))).toBe(true);
    expect(fs.readJSONSync(path.join(LANGUAGE_FOLDER,"package.json")).type || "commonjs").toEqual("commonjs");
    const langSettings = await importModule(path.join(LANGUAGE_FOLDER,"settings.js"));

    expect(langSettings.languages.map(lng=>lng.name).join(",")).toEqual(SUPPORTED_LANGUAGES.join(","));
    expect(langSettings.defaultLanguage).toEqual(DEFAULT_LANGUAGE);
    expect(langSettings.activeLanguage).toEqual(ACTIVE_LANGUAGE);
})





test("提取文本(esm)",(done) =>{
    let code = shelljs.exec(`node ${CLI_INDEX_FILE} extract`).code
    expect(code).toEqual(0);
    // 翻译文件夹
    expect(fs.existsSync(TRANSLATES_FOLDER)).toBe(true);
    // 翻译文件
    const msgFile = path.join(TRANSLATES_FOLDER,"default.json")
    expect(fs.existsSync(msgFile)).toBe(true);
    let messages = fs.readJSONSync(msgFile)
    messages = fs.readJSONSync(msgFile)
    expect("a" in messages).toBeTruthy();
    expect("b" in messages).toBeTruthy();
    expect("c" in messages).toBeTruthy();
    expect("d" in messages).toBeTruthy();
    expect("e" in messages).toBeTruthy();
    done()
})


test("编译命令(esm)",(done) =>{
    shelljs.exec(`node ${CLI_INDEX_FILE} extract`).code
    let code = shelljs.exec(`node ${CLI_INDEX_FILE} compile`).code
    expect(code).toEqual(0);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"index.js"))).toBe(true);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"formatters.js"))).toBe(true);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"cn.js"))).toBe(true);
    expect(fs.existsSync(path.join(LANGUAGE_FOLDER,"en.js"))).toBe(true);
    done()
})









