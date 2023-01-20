import type { PluginOption } from "vite"
export interface Voerkai18nPluginOptions{
    location?: string                                 // 指定当前工程目录
    autoImport?: boolean                               // 是否自动导入t函数
    debug?:boolean                                    // 是否输出调试信息，当=true时，在控制台输出转换匹配的文件清单
    patterns?:(string | RegExp)[]
}
export default function Voerkai18nPlugin(options:Voerkai18nPluginOptions):PluginOption
 