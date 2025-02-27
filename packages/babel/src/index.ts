/**
 *  转译源码中的t翻译函数的翻译内容转换为唯一的id值
 * 
 *  - 将源文件中的t("xxxxx")转码成t("id")
 *  - 自动导入languages/index.js中的翻译函数t
 * 
 *  查看AST: https://astexplorer.net/
 *  Babel插件手册: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
 * 
 *  使用方法:
 * 
 * {
 *  plugins:[
 *      ["voerkai18n",{
 *           
 *      }]
 *  ]
 * 
 * 
 * 
 * }
 * 
 * 
 * 
 */

import {  PluginPass } from '@babel/core';
import {  getIdMap } from "@voerkai18n/utils"
import { hasImportTranslateFunction, hasRequireTranslateFunction, isEsModule } from "./utils";
import * as t from "@babel/types" 
import { NodePath } from '@babel/traverse';
 
export type Voerkai18nBabelPluginOptions = {
    autoImport?:boolean | string
    idMap?:Record<string,string>
}

export default function voerkai18nPlugin(babel:any) {
    const t = babel.types;
    const pluginOptions = {
        autoImport: false,      // 是否自动导入t函数  
        idMap:{}                // 此参数用于测试使用 默认会读取languages/idMap.json文件
    }
    let idMap:Record<string,any> = {};
    return {
        visitor:{ 
            Program(path: NodePath<t.Program>, state:PluginPass & Voerkai18nBabelPluginOptions){ 
                // 转码插件参数可以覆盖默认参数
                const { autoImport,idMap:devIdMap } = Object.assign(pluginOptions,state.opts || {}); 
                if(Object.keys(idMap).length===0){
                    idMap = devIdMap || getIdMap() || {}
                }
                // 是否自动导入t函数
                if(autoImport){
                    let module = isEsModule.call(pluginOptions,path) ? 'esm' : 'cjs' 
                    const importName = "t"
                    const importModule = typeof(autoImport)=== 'string' ? autoImport : "@/languages"
                    if(!["esm","es","cjs","commonjs"].includes(module)) module = 'esm'
                    if(module === 'esm'){
                        //  如果没有定义t函数，则自动导入
                        if(!hasImportTranslateFunction.call(pluginOptions, path)){       
                            path.node.body.unshift(t.importDeclaration([
                                t.ImportSpecifier(t.identifier(importName),t.identifier(importName)
                            )],t.stringLiteral(importModule)))
                        }
                    }else{
                        if(!hasRequireTranslateFunction.call(pluginOptions, path)){ 
                            path.node.body.unshift(t.variableDeclaration("const",[
                                t.variableDeclarator(
                                    t.ObjectPattern([t.ObjectProperty(t.Identifier(importName),t.Identifier(importName),false,true)]),
                                    t.CallExpression(t.Identifier("require"),[t.stringLiteral(importModule)])
                                )
                            ]))
                        }                    
                    }   
                }                          
            },
            // 将t函数的第一个参数转换为id
            CallExpression(path:NodePath<any>){
                if( path.node.callee.name === 't' ){
                    if(path.node.arguments.length>0 && t.isStringLiteral(path.node.arguments[0])){
                        let message = path.node.arguments[0].value
                        const msgId =(message in idMap) ? idMap[message] : message
                        path.node.arguments[0] = t.stringLiteral(String(msgId))
                    }
                }else{
                    path.skip();
                }
            }
        }
    }
}