
 
 /**
  * export type TranslateOptions = Record<string,any>
export type TranslateArgs    = Record<string,any> | number | boolean | string | (number | boolean | string)[] | (()=>TranslateArgs)

  * @param {*} code 
  * @param {*} options 
  * @param {*} options.fileType - 文件类型,取值:js,ts,jsx,tsx,vue,astro等
  * @returns 
  */
function createPrompt(code,options){
    return `
      以下${options.file}源代码,内容如下：
      \`\`\`
      ${code}
      \`\`\`
      将以上代码使用t函数进行国际化处理,要求如下：
          - 使用t函数进行包裹对代码中的字符串常量进行包裹,t函数是一个国际化翻译函数,函数签名为t<T=string>(text:string,args?:TranslateArgs,options?:TranslateOptions):T,其中args和options是可选参数.
          - TranslateOptions类型为:type TranslateOptions = Record<string,any>.
          - TranslateArgs类型为:type TranslateArgs = Record<string,any> | number | boolean | string | (number | boolean | string)[] | (()=>TranslateArgs).
          - 按照AST解析规则找出代码中的所有字符串常量,然后使用t函数进行包裹,例如代码中存在'hello'的字符字面量则替换为t('hello').
          - 只对所有字符串常量进行直接包裹替换，不需要编写代码进行处理.
          - 代码中可能存在单引号和双引号的字符串字面量,全部使用t()函数进行包裹后均使用单引号.
          - 忽略代码注释中的所有字符串.           
          - 当前代码文件位于${options.file},t函数从是${options.langDir}导入的,使用相对路径语法从代码第一行导入t函数。导入的语法由源代码文件模块类型${options.moduleType}决定.
          - 如果字符串字面量已经使用了t()函数包裹，则不要重复处理. 
          - 不需要任何额外的解释,直接输出替换后原始字符串.
          - 如果代码为空，则直接返回空字符串.
          - 只处理字符串中包含语言编码为${options.defaultLanguage}的字符串常量.
    `;
}
  


module.exports = {
    createPrompt
}