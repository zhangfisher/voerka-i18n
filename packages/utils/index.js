const path = require("path")
const shelljs = require("shelljs")
const fs = require("fs-extra")  

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
    // 绝对路径    
    if(!path.isAbsolute(location)){   
        location = path.join(process.cwd(),location)
    }    

    // 发现当前项目根目录
    const projectRoot = getProjectRootFolder(location)

    const searchFolders = [
        path.join(location,"src","languages"),
        path.join(location,"languages")
    ]

    for(let folder of searchFolders){
        if(fs.existsSync(folder)){
            return folder
        }
    }
 
    return null
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
    if(projectFolder){
       return fs.readJSONSync(path.join(projectFolder,"package.json"))
    }
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
        return packageJson.type || "commonjs"
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
        "@voerkai18n/vite":"未安装",
        "@voerkai18n/formatters":"未安装"
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
    fileIsExists,
    isTypeScriptProject
}