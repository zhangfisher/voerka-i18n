/**
 * 
 * 翻译动态变量
 * 
 * 
 * 
 * const name= ""
 * t(name)
 * 
 * const orders = [{name:"fisher"}]
 * 
 * t(()=>orders[0].name,'',{loader:"getDict"})
 * 
 * t(()=>'') 
 * 
 * 
 * 提取要翻译的变量到languages/vars.json
 * 
 * {
 *   $loader: "",
 *   loaders: {
 *      "getDict":getTestLanguageLoader
 *   },
 *   vars:{
 *      "name":"fisher"
 *   },
 * }
 * 
 * async loadDynamic(value:any){
 *     return await fetch(value)
 * }
 * 
 * 
 * 
 */



import { test, vi, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, getTestLanguageLoader, getTestStorage, resetVoerkaI18n } from './_utils';

 
describe('翻译动态变量', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('appScope加载时加载补丁', async () => {     
     
    });

});


