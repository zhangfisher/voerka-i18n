import { hasImport, HasImportOptions } from "./hasImport";

const RequireRegex = /(let|const|var)\s*((\{[^}]*\})|(\w+))\s+=\s*require\(['"]\S+['"]\)/gm

export type AddImportOptions = HasImportOptions & {
    scriptSection?: RegExp
}


export function addImport(code:string,fromModule:string, importName:string, options?:AddImportOptions){    
    let { moduleType,scriptSection } = Object.assign({
        moduleType   : 'auto',
        scriptSection: /(<script[^>]*>)([\s\S]*?)(<\/script>)/gm
    },options) as Required<AddImportOptions>

    if(moduleType === 'auto'){
        moduleType = RequireRegex.test(code) ? 'cjs' : 'ts'
    }
    if(hasImport(code,importName,options as HasImportOptions)){
        return code
    }else{
        const importCode = moduleType == 'cjs' ?   `const { ${importName} } from "${fromModule}"` : `import { ${importName} } from "${fromModule}"`

        let hasScript = false        

        // 在script标签中添加
        code = code.replace(scriptSection,(matched,scriptBegin,scriptContent,scriptEnd)=>{
            hasScript = true
            return matched.replace(scriptContent,scriptBegin+"\n"+importCode + "\n" + scriptContent + "\n" + scriptEnd)
        })
        if(!hasScript){
            code = importCode + "\n" + code
        }
    }
    return code
}



// const code = `
// <script>
// aaaa
// </script>
// <script setup> 
// bbbb
// </script>
// `


// console.log(addImport(code,"languages","t"))
 