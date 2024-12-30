/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type  { VoerkaI18nScope } from "../..";
import { VoerkaI18nFormatterManager } from "./manager";





export class FormatterMixin{
    private _formatterManager:VoerkaI18nFormatterManager | null = null
    // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
    get formatters() {	return this._formatterManager! }                   

    protected _initFormatters(this:VoerkaI18nScope){
        this._formatterManager = new VoerkaI18nFormatterManager(this)         
    }
}
