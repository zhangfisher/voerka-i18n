import fs from "node:fs"


/**
 * 使用正则表达式读取ts/js文件是的默认导出文本内容
 * 
 * 
 */
export function readLanguageMessages(file:string):Record<string,any> | undefined {
    // 读取文件内容
    const content = fs.readFileSync(file, 'utf-8');

    // 正则表达式匹配 ESM 和 CommonJS 模块的默认导出内容
    const esmDefaultExportRegex = /export\s+default\s+({[\s\S]*?})/gm

    let result:string | undefined 

    // 尝试匹配 ESM 模块的默认导出
    let match = esmDefaultExportRegex.exec(content);

    if (match) {
        result = match[1];
    }

    // 尝试匹配 CommonJS 模块的默认导出
    const cjsDefaultExportRegex = /module\.exports\s*=\s*({[\s\S]*?})/gm
  
    match = cjsDefaultExportRegex.exec(content);
    if (match) {
        result = match[1];
    } 
    return result ? JSON.parse(result)  : undefined
}
