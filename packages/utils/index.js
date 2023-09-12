const path = require("path")
const shelljs = require("shelljs")
const fs = require("fs-extra")  
const semver = require('semver')
const replaceAll = require("string.prototype.replaceall")
// 由于replaceAll()方法在nodejs 15版本才支持，所以这里做兼容处理
replaceAll.shim()

/**
 *  
 *  匹配指定路径或文件名称
 *  
 *  const matcher = fileMatcher([
 *    "<pattern>",          // 匹配正则表达式字符串
 *    "!<pattern>",         // 以!开头代表否定匹配
 *    /正则表达式/ 
 *  ],{
 *      basePath:"<指定一个基准目录，所有不是以此开头的均视为不匹配>",
 *      defaultPatterns:["<默认排除的模式>","<默认排除的模式>","<默认排除的模式>"],
 *      debug:<true/>false,是否输出调试信息,当=true时，.test()方法返回[<true/false>,pattern]      *      
 *  })
 * 
 *  matcher.test("<文件名称>") 返回true/false   
 *
 * 
 * 
 * @param {*} patterns 
 * @param {*} basePath          如果指定basePath，则所有不是以basePath开头的文件都排除
 * @param {*} defaultPatterns    默认的匹配模式
 * @param {*} debug              是否输出调试信息
 */

 function fileMatcher(patterns,{basePath,defaultPatterns=[],debug=true}={}) {
    if(basePath) {
        basePath = path.normalize(basePath)
    }    
    //[[pattern,exclude],[pattern,false],[pattern,true]]
    let finalPatterns = []
    let inputPatterns =  Array.isArray(patterns) ? patterns : (patterns ? [patterns] : [])

    // 默认排除模式
    if(defaultPatterns.length===0){        
        finalPatterns.push([/__test__\/.*/,true])
        finalPatterns.push([/.*\/.*\.test\.js$/,true])
        finalPatterns.push([/node_modules\/.*/,true])
        finalPatterns.push([/.*\/node_modules\/.*/,true])
        finalPatterns.push([/.*\/languages\/.*/,true])           // 默认排除语言文件
        finalPatterns.push([/\.babelrc/,true])
        finalPatterns.push([/babel\.config\.js/,true])
        finalPatterns.push([/package\.json$/,true])
        finalPatterns.push([/vite\.config\.js$/,true])
        finalPatterns.push([/^plugin-vue:.*/,true])    
    }

    inputPatterns.forEach(pattern=>{
        if(typeof pattern === "string"){    
            pattern = pattern.replaceAll("**",".*")
                .replaceAll("?","[^\/]?")
                .replaceAll(/(?<!\.)\*/g,"[^\/]*")   
            try{
                // 以!开头的表示排除
                if(pattern.startsWith("!")){
                    finalPatterns.unshift([new RegExp(pattern.substring(1),"g"),true])
                }else{
                    finalPatterns.push([new RegExp(pattern,"g"),false])
                }
            }catch(e){
                if(debug){
                    console.error(`${pattern} is not a valid pattern`)
                }
            }               
        }else{
            finalPatterns.push([pattern,false])
        }
    })

    return {        
        patterns:finalPatterns,
        basePath,
        test: (filename) => {
            let isMatched = false
            let file = filename
            // 如果指定basePath，则文件名称必须是以basePath开头
            if(basePath){
                if(path.isAbsolute(file)){
                    if(!path.normalize(file).startsWith(basePath)){
                        return  debug ? [false,`!^${basePath}`] : false
                    }else{
                        isMatched = true
                    }   
                }   
            }            
            if(finalPatterns.length===0){
                return debug ? [true,"*"] : true
            }else{                
                for(const pattern of finalPatterns){
                    pattern[0].lastIndex = 0
                    if(pattern[1]===true){
                        if(pattern[0].test(file)) return debug ? [false,pattern[0].toString()] : false
                    }else{
                        if(pattern[0].test(file)) return  debug ? [true,pattern[0].toString()] : true
                    }
                }
            }
            return debug ? [isMatched,"*"] : isMatched
        }
    }
}

/**
 * 以floder为基准向上查找文件package.json，并返回package.json所在的文件夹
 * @param {*} folder          起始文件夹，如果没有指定，则取当前文件夹
 * @param {*} exclueCurrent   如果=true，则folder的父文件夹开始查找
 * @returns 
 */
function getProjectRootFolder(folder="./",exclueCurrent=false){
    if(!path.isAbsolute(folder)){
        folder = path.join(process.cwd(),folder)
    }
    try{ 
        const pkgFile =exclueCurrent ? 
                        path.join(folder, "..", "package.json")
                        : path.join(folder, "package.json")
        if(fs.existsSync(pkgFile)){ 
            return path.dirname(pkgFile)
        }
        const parent = path.dirname(folder)
        if(parent===folder) return null
        return getProjectRootFolder(parent,false)
    }catch(e){
        return process.cwd()
    }
}

function fileIsExists(filename){
    try{
        fs.statSync(filename)
        return true
    }catch(e){
        return false
    }
}

/**
 * 自动获取当前项目的languages
 *  
 * @param {*} location 
 */
 function getProjectLanguageFolder(location="./"){
    // 从package.json/voerkai18n中读取
    let { entry } = getSettingsFromPackageJson(location)

    // 绝对路径    
    if(!path.isAbsolute(location)){   
        location = path.join(process.cwd(),location)
    }    
    // 发现当前项目根目录
    const searchFolders = [
        path.join(location,"src",entry),
        path.join(location,entry)
    ]

    for(let folder of searchFolders){
        if(fs.existsSync(folder)){
            return folder
        }
    }
 
    return path.join(process.cwd(),'languages')
}




/**
 * 根据当前输入的文件夹位置自动确定源码文件夹位置
 * 
 * - 如果没有指定，则取当前文件夹
 * - 如果指定是非绝对路径，则以当前文件夹作为base
 * - 查找pack
 * - 如果该文件夹中存在src，则取src下的文件夹
 * -
 * 
 * @param {*} location 
 * @returns 
 */
 function getProjectSourceFolder(location){
    if(!location) {
        location = process.cwd()
    }else{
        if(!path.isAbsolute(location)){
            location = path.join(process.cwd(),location)
        }
    }
    let projectRoot = getProjectRootFolder(location)
    // 如果当前工程存在src文件夹，则自动使用该文件夹作为源文件夹
    if(fs.existsSync(path.join(projectRoot,"src"))){
        projectRoot = path.join(projectRoot,"src")
    }
    return projectRoot
}


/**
 * 读取指定文件夹的package.json文件，如果当前文件夹没有package.json文件，则向上查找
 * @param {*} folder 
 * @param {*} exclueCurrent    = true 排除folder，从folder的父级开始查找
 * @returns 
 */
 function getCurrentPackageJson(folder,exclueCurrent=true){ 
    let projectFolder = getProjectRootFolder(folder,exclueCurrent)
    let packageJsonFile = path.join(projectFolder,"package.json")
    if(fs.existsSync(packageJsonFile)){
       return fs.readJSONSync(path.join(projectFolder,"package.json"))
    }
}
/**
 * 
 * 从当前文件的package.json读取voerkai18n配置
 * 
 */
 function getSettingsFromPackageJson(entry){
	const pkg=  getCurrentPackageJson(entry,false)
    const settings = {
        entry:"languages"
    }
	if(typeof(pkg)=='object' &&  "voerkai18n" in pkg){
		Object.assign(settings,pkg.voerkai18n)
	} 
	return settings
}
/**
 * 判断当前是否是Typescript工程
 * 
 * 
 */
function isTypeScriptProject(){
    let projectFolder = getProjectRootFolder(process.cwd(),false)
    if(projectFolder){
       return fileIsExists(path.join(projectFolder,"tsconfig.json"))
             || fileIsExists(path.join(projectFolder,"Src","tsconfig.json"))
    }
}

/**
 * 
 * 返回当前项目的模块类型
 * 
 * 从当前文件夹开始向上查找package.json文件，并解析出语言包的类型
 * 
 * @param {*} folder 
 */
 function findModuleType(folder){
    let packageJson = getCurrentPackageJson(folder)
    try{ 
        return packageJson.type=='module' ? 'esm' : "cjs"
    }catch(e){
        return "esm"
    }
}

/**
 * 判断是否已经安装了依赖
 * 
 * isInstallDependent("@voerkai18n/runtime")
 * 
*/
function isInstallDependent(url){
    try{
        // 简单判断是否存在该文件夹node_modules/@voerkai18n/runtime
        let projectFolder =  getProjectRootFolder(process.cwd())
        if(fs.existsSync(path.join(projectFolder,"node_modules","@voerkai18n/runtime"))){
            return true
        }
        // 如果不存在，则尝试require
        require(url)
    }catch(e){
        return false
    }
}

/**
 * 获取当前包的版本号
 */
function getInstalledPackages(){
    const packages = {
        "@voerkai18n/runtime":"未安装",
        "@voerkai18n/babel":"未安装",
        "@voerkai18n/vue":"未安装",
        "@voerkai18n/react":"未安装",
        "@voerkai18n/vite":"未安装"
    }
    for(let package of Object.keys(packages)){
        try{
            require(package)
        }catch{
            packages[package] = "已安装"
        }
    }

}

/**
 * 判断是否是JSON对象
 * @param {*} obj 
 * @returns 
 */
function isPlainObject(obj){
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    var baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto; 
}
/**
 * 判断值是否是一个数字
 * @param {*} value 
 * @returns 
 */
 function isNumber(value){
    if(!value) return false
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false        
    try{
        if(value.includes(".")){
            let v = parseFloat(value)
            if(value.endsWith(".")){                
                return !isNaN(v) && String(v).length===value.length-1
            }else{
                return !isNaN(v) && String(v).length===value.length
            }            
        }else{
            let v = parseInt(value)
            return !isNaN(v) && String(v).length===value.length
        }    
    }catch{
        return false
    }
}


 
/**
 * 检测当前工程是否是git工程
 */
 function isGitRepo(){
    return shelljs.exec("git status", {silent: true}).code === 0;
}

/**
 * 简单进行对象合并
 * 
 * options={
 *    array:0 ,        // 数组合并策略，0-替换，1-合并，2-去重合并
 * }
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @returns 合并后的对象
 */
function deepMerge(toObj,formObj,options={}){
    let results = Object.assign({},toObj)
    Object.entries(formObj).forEach(([key,value])=>{
        if(key in results){
            if(typeof value === "object" && value !== null){
                if(Array.isArray(value)){
                    if(options.array === 0){
                        results[key] = value
                    }else if(options.array === 1){
                        results[key] = [...results[key],...value]
                    }else if(options.array === 2){
                        results[key] = [...new Set([...results[key],...value])]
                    }
                }else{
                    results[key] = deepMerge(results[key],value,options)
                }
            }else{
                results[key] = value
            }
        }else{
            results[key] = value
        }
    })
    return results
}


/**
 * 获取指定变量类型名称
 * getDataTypeName(1) == Number
 * getDataTypeName("") == String
 * getDataTypeName(null) == Null
 * getDataTypeName(undefined) == Undefined
 * getDataTypeName(new Date()) == Date
 * getDataTypeName(new Error()) == Error
 * 
 * @param {*} v 
 * @returns 
 */
 function getDataTypeName(v){
	if (v === null)  return 'Null' 
	if (v === undefined) return 'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
};


 
/**
 * 在当前工程自动安装@voerkai18n/runtime
 * @param {*} srcPath 
 * @param {*} opts 
 */
 function installVoerkai18nRuntime(srcPath){
    const projectFolder =  getProjectRootFolder(srcPath || process.cwd())
    if(fs.existsSync("pnpm-lock.yaml")){
        shelljs.exec("pnpm add @voerkai18n/runtime")
    }else if(fs.existsSync("yarn.lock")){
        shelljs.exec("yarn add @voerkai18n/runtime")
    }else{
        shelljs.exec("npm install @voerkai18n/runtime")
    }
}   

function getPackageTool(){
    const projectFolder =  getProjectRootFolder(process.cwd())
    if(fs.existsSync(path.join(projectFolder,"pnpm-lock.yaml"))){        
        return 'pnpm'
    }else if(fs.existsSync(path.join(projectFolder,"yarn.lock"))){
        return 'yarn'
    }else{
        return 'npm'
    } 
}   
/**
 * 异步执行脚本并返回输出结果
 * @param {*} script 
 * @param {*} options 
 * @returns 
 */
 async function asyncExecShellScript(script,options={}){
    const { silent=true} = options
    return new Promise((resolve,reject)=>{
        shelljs.exec(script,{silent,...options,async:true},(code,stdout)=>{
            if(code>0){
                reject(new Error(`执行<${script}>失败: ${stdout.trim()}`))
            }else{
                resolve(stdout.trim())
            }
        })   
    }) 
}
/**
 * 从NPM获取包最近发布的版本信息
 * {
    tags: { latest: '1.1.30' },
    license: 'MIT',
    author: 'wxzhang',
    version: '1.1.30-latest',
    latestVersion: '1.1.30',
    firstCreated: '2022-03-24T09:32:51.748Z',
    lastPublish: '2023-01-28T08:49:33.139Z',
    size: 888125
    }
 * @param {*} packageName 
 */
 async function getPackageReleaseInfo(packageName) {
    try{
        let results = await asyncExecShellScript.call(this,`npm info ${packageName} --json`,{silent:true})
        const info = JSON.parse(results)
        const distTags = info["dist-tags"]
        // 取得最新版本的版本号，不是latest
        let lastVersion = Object.entries(distTags).reduce((result,[tag,value])=>{
            if(semver.gt(value, result.value)){
                result = {tag,value}
            }
            return result
        },{tag:'latest',value:info["version"]})

        return {
            tags         : distTags, 
            license      : info["license"], 
            author       : info["author"],
            version      : `${lastVersion.value}-${lastVersion.tag}`,
            latestVersion: info["version"],
            firstCreated : info.time["created"],
            lastPublish  : info.time["modified"],
            size         : info.dist["unpackedSize"] 
        }
    }catch(e){
        console.error(`ERROR: 执行npm info ${packageName}出错: ${e.stack}`)
        return null;        
    }    
}


/**
 * 在当前工程升级@voerkai18n/runtime
 * @param {*} srcPath 
 * @param {*} opts 
 */
function updateVoerkai18nRuntime(srcPath){
    const projectFolder =  getProjectRootFolder(srcPath || process.cwd())
    if(fs.existsSync(path.join(projectFolder,"pnpm-lock.yaml"))){        
        shelljs.exec("pnpm upgrade --latest @voerkai18n/runtime")        
    }else if(fs.existsSync(path.join(projectFolder,"yarn.lock"))){
        shelljs.exec("yarn upgrade @voerkai18n/runtime")
    }else{
        shelljs.exec("npm update --save @voerkai18n/runtime") 
    } 
}   


/**
 * 在指定文件夹下创建package.json文件
 * @param {*} targetPath 
 * @param {*} moduleType 
 * @returns 
 */
function createPackageJsonFile(targetPath,moduleType="auto"){
    if(moduleType==="auto"){
        moduleType = findModuleType(targetPath)
    }
    const packageJsonFile = path.join(targetPath, "package.json")
    if(["esm","es","module"].includes(moduleType)){
        fs.writeFileSync(packageJsonFile,JSON.stringify({type:"module",license:"MIT"},null,4))
        if(moduleType==="module"){
            moduleType = "esm"
        }
    }else{
        fs.writeFileSync(packageJsonFile,JSON.stringify({license:"MIT"},null,4))
    }
    return moduleType
}


async function installPackage(packageName,{silent}={silent:true}){
    const packageTool = getPackageTool()
    try{
        if(packageTool=='pnpm'){
            await asyncExecShellScript(`pnpm add ${packageName}`,{silent}) 
        }else if(packageTool=='yarn'){
            await asyncExecShellScript(`yarn add ${packageName}`,{silent})        
        }else{
            await asyncExecShellScript(`npm install ${packageName}`,{silent})        
        }
    }catch{
        await asyncExecShellScript(`npm install ${packageName}`,{silent})        
    }      
} 

function upgradePackage(packageName){
    const packageTool = getPackageTool()
    try{
        if(packageTool=='pnpm'){
            shelljs.exec(`pnpm update ${packageName}`)        
        }else if(packageTool=='yarn'){
            shelljs.exec(`yarn upgrade ${packageName}`)        
        }else{
            shelljs.exec(`npm upgrade ${packageName}`)        
        }
    }catch{
        shelljs.exec(`npm upgrade ${packageName}`)        
    }    
}


/**
 * 读取当前工程下languages/idMap.(js|ts)文件 
 * 
 * @param {*} location  项目根文件夹或者当前项目下的任意一个文件夹 
 * @returns 
 */
function readIdMapFile(location="./"){

    const { entry='languages' }  = getSettingsFromPackageJson(location)

    let searchIdMapFiles = []
    if(!path.isAbsolute(location)){
        location =  path.join(process.cwd(),location)
    }
    searchIdMapFiles.push(path.join(location,"src",`${entry}/idMap.js`))
    searchIdMapFiles.push(path.join(location,`${entry}/idMap.js`))
    searchIdMapFiles.push(path.join(location,"idMap.js"))

    searchIdMapFiles.push(path.join(location,"src",`${entry}/idMap.ts`))
    searchIdMapFiles.push(path.join(location,`${entry}/idMap.ts`))
    searchIdMapFiles.push(path.join(location,"idMap.ts"))

    let projectRoot = getProjectRootFolder(location)        
    searchIdMapFiles.push(path.join(projectRoot,"src",`${entry}/idMap.js`))
    searchIdMapFiles.push(path.join(projectRoot,`${entry}/idMap.js`))
    searchIdMapFiles.push(path.join(projectRoot,"idMap.js"))
        
    searchIdMapFiles.push(path.join(projectRoot,"src",`${entry}/idMap.ts`))
    searchIdMapFiles.push(path.join(projectRoot,`${entry}/idMap.ts`))
    searchIdMapFiles.push(path.join(projectRoot,"idMap.ts"))

    let idMapFile
    for( idMapFile of searchIdMapFiles){
        // 如果不存在idMap文件，则尝试从location/languages/中导入
        if(fs.existsSync(idMapFile)){ 
            try{
                // 由于idMap.js可能是esm或cjs，并且babel插件不支持异步
                // 当require(idMap.js)失败时，对esm模块尝试采用直接读取的方式
                return require(idMapFile)
            }catch(e){
                // 出错原因可能是因为无效require esm模块，由于idMap.js文件格式相对简单，因此尝试直接读取解析
                try{
                    let idMapContent = fs.readFileSync(idMapFile).toString()
                    idMapContent = idMapContent.trim().replace(/^\s*export\s*default\s/g,"")
                    return JSON.parse(idMapContent)
                }catch{ }                        
            }
        }
    }
    throw new Error(`${idMapFile}文件不存在,无法对翻译文本进行转换。`)
    return {}
}


//const TranslateRegex = /\bt\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>[^\1]*?)(?=(\1\s*\))|(\1\s*\,))/gm
// 匹配t('xxxx')的正则表达式
const TranslateRegex =/(?<=\bt\(\s*("|'){1})(?<text>[^\1]*?)(?=(\1\s*\))|(\1\s*\,))/gm

/**
 * 将code中的t("xxxx")使用idMap进行映射为t("1"),t("2")的形式
 * 
 * @param {*} code 
 * @param {*} idmap 
 */
function replaceTranslateText(code, idmap) {
    return code.replaceAll(TranslateRegex, (message) => {
        if(message in idmap) {
            return idmap[message]
        }else{
            let result
            // 为什么要decodeURIComponent/unescape?  一些vite插件会将中文编码转义导致无法进行替换,所以要解码一下
            try{
                result = decodeURIComponent(message.replaceAll("\\u","%u"))
                return result in idmap ? idmap[result] : message
            }catch{
                return message
            }            
        }
    })
    // decodeURI 或 decodeURIComponent 对特殊字符进行转义序列编码和解码。
}

// 匹配 import {t } from 的正则表达式
const importTRegex = /import\s*\{([^\{t]*)\bt\b(.*)\}\s*from/gm

 
/**
 * 判定代码中是否导入了Translate函数
 * @param {*} code 
 * @returns 
 */
function hasImportTranslateFunction(code){
    return /import\s*\{([^\{t]*)\bt\b(.*)\}\s*from/gm.test(code)
}


function importTranslateFunction(code,sourceFile,langPath){
    let importSource = path.relative(path.dirname(sourceFile),langPath)
    if(!importSource.startsWith(".")){
        importSource = "./" + importSource
    }
    importSource= importSource.replaceAll("\\","/")
    const extName = path.extname(sourceFile)
    // Vue文件 
    if(extName==".vue"){
        // 优先在<script setup></script>中导入
        const setupScriptRegex = /(^\s*\<script.*\s*setup\s*.*\>)/gmi
        if(setupScriptRegex.test(code)){
            code = code.replace(setupScriptRegex,`$1\nimport { t } from '${importSource}';`)
        }else{// 如果没有<script setup>则在<script></script>中导入
            code = code.replace(/(^\s*\<script.*\>)/gmi,`$1\nimport { t } from '${importSource}';`)
        }
    }else if(['.jsx','.js','.ts','.tsx'].includes(extName)){  
        // 普通js/ts文件直接添加到最前面
        code = code = `import { t } from '${importSource}';\n${code}`
    }   
    return code                         
}

/**
 * 检测当前环境是否已经安装了指定的包
 * 如果已安装则返回
 * {
 *    version:"<版本号>",
 *    path:"<安装路径>"
 * }
 * 如果未安装则返回null
 * @param {*} packageName 
 */
function getInstalledPackageInfo(packageName,fields=[]){
    try{
        const packagePath = getProjectRootFolder(path.dirname(require.resolve(packageName)))
        const pkgInfo = fs.readJSONSync(path.join(packagePath,"package.json"))
        let results = {
            version: pkgInfo.version,
            path: packagePath,
        }
        for(let field in fields){
            if(field in pkgInfo){
                results[field] = pkgInfo[field]
            }else{
                results[field] = null
            }
        }
        return results
    }catch(e){
        return null
        // if(e instanceof Error && e.code=="MODULE_NOT_FOUND"){
        //     return null;
        // }else{

        // }
    }    

}

module.exports = {
    fileMatcher,                            // 文件名称匹配器
    getProjectRootFolder,                   // 查找获取项目根目录
    createPackageJsonFile,                  // 创建package.json文件
    getProjectSourceFolder,                 // 获取项目源码目录
    getCurrentPackageJson,                  // 查找获取当前项目package.json
    getProjectLanguageFolder,               // 获取当前项目的languages目录
    findModuleType,                         // 获取当前项目的模块类型 
    isInstallDependent,                     // 判断是否已经安装了依赖
    installVoerkai18nRuntime,               // 在当前工程自动安装@voerkai18n/runtime
    updateVoerkai18nRuntime,                // 在当前工程升级@voerkai18n/runtime
    isPlainObject,                          // 判断是否是普通对象
    isNumber,                               // 判断是否是数字
    deepMerge,                              // 深度合并对象
    getDataTypeName,                        // 获取指定变量类型名称
    isGitRepo,                              // 判断当前工程是否是git工程
    fileIsExists,                           // 检查文件是否存在
    isTypeScriptProject,                    // 当前是否是TypeScript工程
    getPackageTool,                         // 获取当前工程使用的包工具，如pnpm,yarn,npm
    installPackage,                         // 安装指定的包
    readIdMapFile,                          // 读取当前工程下的idMap文件
    replaceTranslateText,                   //    
    hasImportTranslateFunction,             // 检测代码中是否具有import { t } from "xxxx"
    importTranslateFunction,                // 在代码中导入t函数  
    asyncExecShellScript,                   // 异步执行一段脚本并返回结果
    getPackageReleaseInfo,                  // 从npm上读取指定包的信息
    getInstalledPackageInfo,                // 返回当前工程已安装的包信息，主要是版本号
    upgradePackage,                         // 升级包
    getSettingsFromPackageJson              // 从当前工程的package.json中读取voerkai18n配置
}