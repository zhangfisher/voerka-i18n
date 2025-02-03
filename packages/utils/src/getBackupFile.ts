import fs from 'node:fs'
import path from 'node:path'


export function getBackupFile(file:string){
    let i = 0
    const extName = path.extname(file)
    while(true){
        const bakFile =  file.replace(extName,`.bak${i === 0 ? '' : i}${extName}`)
        if(!fs.existsSync(bakFile)){
            return bakFile
        }
        i++
    }
}
