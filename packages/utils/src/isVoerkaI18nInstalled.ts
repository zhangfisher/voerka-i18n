import fs from "node:fs";
import path from "node:path";
import { getLanguageDir } from "./getLanguageDir";

/**
 * 
 * 检查当前工程是否已经安装了voerkai18n支持
 * 
 * @returns 
 */
export function isVoerkaI18nInstalled(): boolean {
    const langDir = getLanguageDir({
        autoCreate: false
    });
    const settingsFile = path.join(langDir, "settings.json");
    return fs.existsSync(settingsFile); 
}