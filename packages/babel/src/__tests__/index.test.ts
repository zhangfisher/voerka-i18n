import { test,expect } from "vitest"
import babel from '@babel/core'
import voerkai18nPlugin from '../index'
import type { Voerkai18nBabelPluginOptions } from ".."

function transform(code:string,options?:Voerkai18nBabelPluginOptions) {
    try{
        return babel.transform(code, {
            plugins: [                
                [
                    voerkai18nPlugin,
                    Object.assign({
                        idMap:{
                            "hello":"1" 
                        }
                    },options)
                ]
            ],
            presets: ['@babel/preset-env'],
            parserOpts: {
                sourceType: "script"
              }
          })!.code!
    }catch(e:any){
        console.error(e)
        return code
    }
}

test('should transform code with voerkai18nPlugin', () => {
  const inputCode = `
    const message = t('hello');
  `; 

  const outputCode = transform(inputCode) 

  expect(outputCode.includes('t("1")')).toBe(true)

});

// test('should transform code with autoImport', () => {
//     const inputCode = `
//       const message = t('hello');
//     `; 
  
//     const outputCode = transform(inputCode,{autoImport:true}) 
  
//     expect(outputCode.includes('t("1")')).toBe(true)
//     expect(outputCode.includes('import { t } from "@/languages"')).toBe(true)
  
//   });