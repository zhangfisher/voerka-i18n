import fs from "node:fs"

/**
 * 将data更新到file中
 * 
 * file是一个具有默认导出的esm或cjs文件，data是一个对象
 * 
 * 例:
 * 
 * zh-CN.ts
 * export default {
 *   "12": "aaaa" 
 * }
 *  
 * writeLanguageMessages("zh-CN.ts",{"13":"bbbb"})
 * 
 * 执行后file更新为:
 * export default {
 *   "12": "aaaa",
 *   "13": "bbbb"  
 * }
 * 
 */
export function writeLanguageMessages(file:string,data:Record<string,any>){
    // 读取文件内容
    const content = fs.readFileSync(file, 'utf-8');
  
    // 正则表达式匹配 ESM 和 CommonJS 模块的默认导出内容
    const esmDefaultExportRegex = /export\s+default\s+({[\s\S]*?});/;
    const cjsDefaultExportRegex = /module\.exports\s*=\s*({[\s\S]*?});/;
  
    // 尝试匹配 ESM 模块的默认导出
    let match = esmDefaultExportRegex.exec(content);
    let isESM = true;
    if (!match) {
      // 尝试匹配 CommonJS 模块的默认导出
      match = cjsDefaultExportRegex.exec(content);
      isESM = false;
    }
  
    if (match) {
      // 解析现有的默认导出对象
      const existingData = JSON.parse(match[1]);
  
      // 合并新的数据
      const updatedData = { ...existingData, ...data };
  
      // 将更新后的内容写回文件
      const updatedContent = isESM
        ? `export default ${JSON.stringify(updatedData, null, 2)};`
        : `module.exports = ${JSON.stringify(updatedData, null, 2)};`;
  
      fs.writeFileSync(file, updatedContent, 'utf-8');
    } else {
      throw new Error('No default export found in the file');
    }
  
  }

  writeLanguageMessages(String.raw`C:\Work\Code\voerka-i18n\examples\vue3\src\languages\zh-CN.ts`,{"13":"bbbb"})

  