const path = require("path") 
const fs = require("fs") 
const readJson = require("readjson")

async function importModule(url){
    try{
        return require(url)
    }catch{
        return await import(url)
    }    
}
/**
 * 从当前文件夹开始向上查找package.json文件，并解析出语言包的类型
 * @param {*} folder 
 */
 function findModuleType(folder){
    try{
        let pkgPath = path.join(folder, "package.json")
        if(fs.existsSync(pkgPath)){
            let pkg = readJson.sync(pkgPath)
            return pkg.type || "commonjs"
        }
        let parent = path.dirname(folder)
        if(parent===folder) return null
        return findModuleType(parent)
    }catch(e){
        return "esm"
    }
}

function createPackageJsonFile(targetPath,moduleType="auto"){
    if(moduleType==="auto"){
        moduleType = findModuleType(targetPath)
    }
    const packageJsonFile = path.join(targetPath, "package.json")
    if(["esm","es"].includes(moduleType)){
        fs.writeFileSync(packageJsonFile,JSON.stringify({type:"module",license:"MIT"},null,4))
    }else{
        fs.writeFileSync(packageJsonFile,JSON.stringify({license:"MIT"},null,4))
    }
    return moduleType
}


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
 * 
 * getExportContent({a:1})  ==   export let a = 1
 * 
 * @param {*} values 
 * @param {*} moduleType 
 * @returns 
 */
function generateExportContents(values,{moduleType="esm",varExportDeclare="let"}={}){
    if(!isPlainObject(values)) throw new TypeError("export value must be a function or plain object") 
    let results = []
    let varExports = [] 
    let varExportSyntax = moduleType === "esm" ?  `export ${varExportDeclare} `  : "module.exports."
    let funcExportSyntax = moduleType === "esm" ? `export ` : "module.exports."

    Object.entries(values).forEach(([name,value])=>{
        if(Array.isArray(value) || isPlainObject(value)){ 
            results.push(`${varExportDeclare} ${name} = ${JSON.stringify(value,null,4)}`)
        }else if(typeof(value)==="function"){                
            if(value.prototype){ 
                results.push(value.toString())
            }else{// 箭头函数
                results.push(`const ${name} = ${value.toString()}`)                    
            }
        }else{
            results.push(`${varExportDeclare} ${name} = ${JSON.stringify(value)}`)
        }                
    })
     
    if(moduleType === "esm"){
        results.push(`export {\n\t${Object.keys(values).join(",\n\t")}\n}`)
    }else{ fu
        results.push(`module.exports = {\n\t${Object.keys(values).join(",\n\t")}\n}`)
    }

    return  results.join("\n")
}

/**
 * 创建js文件
 * @param {*} filename 
 * @param {*} defaultExports  
 * @param {*} namedExports    {name:value}
 * 
 * @param {*} moduleType 
 */
function createJsModuleFile(filename,defaultExports={},namedExports={},moduleType="esm"){
    let jsContents = []
    if(moduleType === "esm"){
        Object.entries(namedExports).forEach(([name,value])=>{
           
        }) 
        jsContents.push
    }else{
        
    }
}
module.exports = {
    importModule,
    findModuleType,
    createPackageJsonFile
}


