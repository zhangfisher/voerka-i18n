/**
 * 
 * 获取语言文件域Domains
 *  
 */
import { getLanguageDir } from "./getLanguageDir";
import path from "node:path"
import { glob } from "glob"

/**
 * 
 * {default:"路径",}
 * {server:"languages/server", client:"languages/client"}
 * 
 * @returns {Record<string,string>} 
 * 
 */
export function getLanguageDomains(langDir?: string):Record<string,string>{
    langDir = langDir || getLanguageDir();
    const files = glob.sync( "*.*", {
                            cwd:langDir, 
                            mark:true,
                            absolute:true
                        })
    if(files.some(file=>["idMap.json","settings.json"].includes(path.basename(file)))){
        return {default:langDir}
    }else{
        return files.filter(file=>file.endsWith(path.sep)).reduce<Record<string,string>>((result,file)=>{
            result[path.basename(file)] = file
            return result 
        },{})
    } 
}
  
  