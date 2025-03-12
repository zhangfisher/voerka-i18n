


export type HasImportOptions = {
    moduleType:'ts' | 'esm' | 'cjs' | 'auto'    
}

const RequireRegex = /(let|const|var)\s*((\{[^}]*\})|(\w+))\s+=\s*require\(['"]\S+['"]\)/gm
// const ImportRegex = /import\s*((\{[^}]*\})|(\w+))\s+from\s+['"]\S+['"]/gm

/**
 * 判断代码中是否有导入某个模块的
 * 
 * 
 * hasImport(code,"t")
 * 
 * 
 * 
 * 
 * @param code 
 * @param importName 
 * @param moduleType 
 * @returns 
 */
export function hasImport(code:string, importName:string, options?: HasImportOptions):boolean{
    let { moduleType } = Object.assign({moduleType: 'auto'},options) as HasImportOptions    
    if(moduleType === 'auto'){
        moduleType = RequireRegex.test(code) ? 'cjs' : 'ts'
    }
    let reg:RegExp
    if(moduleType === 'ts' || moduleType === 'esm'){       
        reg = new RegExp(`import\\s+\\{[^}]*${importName}[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`)
    }else{
        reg = new RegExp(`(let|const|var){1}\\s+\\{[^}]*${importName}[^}]*\\}\\s*=\\s*require\\(['"]([^'"]+)['"]\\)`)
    }
    return reg.test(code)
}


// const tsCode = [
//     `import { t } from "languages"`,
//     `import { t,i18nScope } from "./languages"`,
//     `import { i18nScope, Translate, t } from "./languages"`,
//     `import { i18nScope,t,  Translate } from "./languages"`,
//     `import t from "./languages"`,
// ]

// tsCode.forEach(code=>{
//     console.log(code," = ",hasImport(code,"t","ts"))
// })


// console.log("------------------")

// const jsCode = [
//     `const { t } =require("languages")`,
//     `let  { t,i18nScope }  =require("./languages")`,
//     `var { i18nScope, Translate, t }  =require("./languages")`,
//     `let { i18nScope,t,  Translate }  =require("./languages")`,
//     `const t  =require("./languages")`,
// ]

// jsCode.forEach(code=>{
//     console.log(code," = ",hasImport(code,"t","cjs"))
// })
