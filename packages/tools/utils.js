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

/**
 * 
 * JSON.stringify在将一个JSON转化为字符串时会对字符串里面的\t等转义符进行再次转义
 * 导致在使用包含\t等转义符为key时会出现问题
 * 
 * 
 * @param {*} obj 
 * @returns 
 */
function escape(str){
    return str.replaceAll("\t","\\t")
}

function ObjectToString(obj,{indent=4,alignKey=true}={}){
    function nodeToString(node,level,last=false){
        let results = [],beginChar = "",endChar = "" 
        level++
        if(Array.isArray(node)){
            beginChar = "[\n"
            node.forEach((value,index)=>{

            })
            endChar =" ".repeat((level-1) * indent) + ( last ? "]" : "]\n")
        }else if(isPlainObject(node)){
            beginChar = "{\n"
            const length = Object.keys(node).length
            const indentSpace = " ".repeat(level * indent)
            let alignIndent = 0
            Object.entries(node).forEach(([key,value],index)=>{
                const isLastItem = index ===length-1    
                alignIndent = Math.max(getStringWidth(key),alignIndent)
                let item = [`${indentSpace}"${key}"`,value]
                if(Array.isArray(value) || isPlainObject(value)){
                    item[1] = nodeToString(value, level,isLastItem)
                }else if(typeof(value)==="string"){
                    item[1] = `"${value.toString()}"`
                }else if(typeof(value)==="number"){
                    item[1] = `${value.toString()}`
                }else if(typeof(value)==="boolean"){
                    item[1] = `${value.toString()}`
                }   
                // 如果最后一项     
                if(!isLastItem){
                    item[1] = item[1]+","
                }else{
                    item[1] = item[1]+"\n"
                }
                results.push(item)
            })
            endChar =" ".repeat((level-1) * indent) + ( last ? "}" : "}\n")
            return beginChar + results.map(item=>{
                if(alignKey){
                    return `${escape(item[0])}${ " ".repeat(alignIndent-getStringWidth(item[0].trim())+2)}: ${escape(item[1])}`
                }else{
                    return `${escape(item[0])}: ${escape(item[1])}`
                }
            }).join("\n") + endChar
       }
      
    }
    return nodeToString(obj,0,true)
}


module.exports = {
    importModule,
    findModuleType,
    createPackageJsonFile
}


