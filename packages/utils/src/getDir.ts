import fs from "node:fs"
import path from "node:path"


/**
 * 确保指定的目录存在。如果目录不存在，将会创建该目录。
 *
 * @param spath - 目录的路径。如果路径不是绝对路径，将会相对于当前工作目录进行解析。
 */
export function getDir(spath:string){
    spath = path.isAbsolute(spath) ? spath : path.join(process.cwd(),spath)
    if(!fs.existsSync(spath)){
        fs.mkdirSync(spath)
    }
    return spath
}