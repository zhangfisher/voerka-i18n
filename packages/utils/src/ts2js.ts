import { ScriptTarget,ModuleKind,ModuleResolutionKind } from "typescript"

export type Ts2JsOptions = {
    target?                      : ScriptTarget
    module?                      : ModuleKind
    moduleResolution?            : ModuleResolutionKind
    esModuleInterop?             : boolean
    allowSyntheticDefaultImports?: boolean
}


export function ts2js(tscode:string,options?:Ts2JsOptions):string{
    const ts = require("typescript")
    const compilerOptions = Object.assign({
        module                      : ts.ModuleKind.ESNext,
        target                      : ts.ScriptTarget.ESNext,
        moduleResolution            : ts.ModuleResolutionKind.NodeJs,
        esModuleInterop             : true,
        allowSyntheticDefaultImports: true,
        strict:false
    },options)
    const {
        outputText
    } = ts.transpileModule(tscode, {
        compilerOptions 
    }) 
    return outputText
}

export function ts2cjs(tscode:string,options?:Ts2JsOptions):string{
    return ts2js(tscode,Object.assign({
        module:ModuleKind.CommonJS,
        target:ScriptTarget.ESNext,
        esModuleInterop             : false,
        allowSyntheticDefaultImports: false 
    },options))
}
let source = `
import path from 'path'
import { NodeJsStandard } from './type-fest/source/package-json';
console.log(path.resolve(__dirname,'./a.js'))
export const a = 1
export const b = 2
`

console.log(ts2cjs(source))

  
