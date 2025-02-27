import * as t from "@babel/types"
import { NodePath } from '@babel/traverse';
import type { Voerkai18nBabelPluginOptions } from ".";


/**
 * 判断当前是否是一个esmodule，判断依据是
 * - 包含import语句
 * - 包含export语句
 
 * @param {*} path 
 */
export function isEsModule(this:Voerkai18nBabelPluginOptions,path:NodePath<any>){
    for(let ele of path.node.body){
        if(ele.type==="ImportDeclaration" 
            || ele.type==="ExportNamedDeclaration" 
            || ele.type==="ExportDefaultDeclaration"
        ){
            return true
        }
    } 
}
/**
 * 判断是否导入了翻译函数 
 * import { t } from "./i18n"
 * const { t }  form "./languages"
 * @param {*} path 
 * @returns  
 */
export function hasImportTranslateFunction(this:Voerkai18nBabelPluginOptions,path:NodePath<any>){  
    for(let ele of path.node.body){
        if(ele.type==="ImportDeclaration"){ 
            if(Array.isArray(ele.specifiers) 
                && ele.specifiers.findIndex((s:any) => (s.type === "ImportSpecifier")  
                && (s.imported.name =='t') 
                && (s.local.name==='t'))>-1
            ){               
                return true
            }
        }
    }
}
export function hasRequireTranslateFunction(this:Voerkai18nBabelPluginOptions,path:NodePath<any>){ 
    for(let ele of path.node.body){
        if(ele.type==="VariableDeclaration"){ 
            if(Array.isArray(ele.specifiers) 
                && ele.specifiers.findIndex((s:any) => s.type === "ImportSpecifier"  
                && s.imported.name == 't'
                && s.local.name=== 't')>-1){
                return true
            }
        }
    }
}