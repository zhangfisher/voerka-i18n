const path = require("path")

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
            pattern.replaceAll("**",".*")
            pattern.replaceAll("?","[^\/]?")
            pattern.replaceAll(/(?<!\.)\*/g,"[^\/]*")            
            // 以!开头的表示排除
            if(pattern.startsWith("!")){
                finalPatterns.unshift([new RegExp(pattern.substring(1),"g"),true])
            }else{
                finalPatterns.push([new RegExp(pattern,"g"),false])
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


function getProjectRootFolder(folder,exclueCurrent=false){
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

module.exports = {
    fileMatcher,
    getProjectRootFolder
}