import type { VoerkaI18nSettings } from "@voerkai18n/runtime"
import  { getLanguageDir } from "./getLanguageDir"
import { getVoerkaI18nSettings } from "./getVoerkaI18nSettings"
import { getPackageModuleType } from "flex-tools/package/getPackageModuleType"
import { isTypeScriptPackage } from "flex-tools/package/isTypeScriptPackage"
import path from "node:path"

export type VoerkaI18nCliContext= VoerkaI18nSettings & { 
    langDir         : string
    langRelDir      : string
    typescript      : boolean
    moduleType      : "esm" | "cjs" | undefined
}

export async function getCliContext(options?:Record<string,any>) { 

    const settings = await getVoerkaI18nSettings() as VoerkaI18nCliContext
    settings.langDir = getLanguageDir()
    settings.langRelDir = path.relative(process.cwd(),settings.langDir).replaceAll(path.sep,"/")    

    const patterns = [
        "!coverage",
        "!.pnpm",
        "!**/*.test.*",
        "!**/*.spec.*",
        "!.vscode",
        "!dist",
        "!.git",
        "!.turbo",
        "!**/*.d.ts",
        "!node_modules",
        "!"+settings.langRelDir 
    ]
    if(Array.isArray(settings.patterns)){
        patterns.push(...settings.patterns)
    }
    if(Array.isArray(options?.patterns)){
        patterns.push(...options.patterns)
        delete options.patterns
    }
    // 如果所有的patterns都是排除模式，则添加默认的包含模式
    if(patterns.every(p=>p.startsWith("!"))){
        patterns.push("**/*.{js,jsx,ts,tsx,vue,astro,svelte}")
    }
    settings.patterns = patterns

    if(!settings.typescript) settings.typescript = isTypeScriptPackage()
    if(!settings.moduleType) settings.moduleType = getPackageModuleType()
    Object.assign(settings,options)
    return settings
}
