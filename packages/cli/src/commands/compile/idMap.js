/**
 * 
 * 生成IdMap文件
 * 
 */
const { t } = require("../../i18n"); 
const path = require("node:path");
const { writeFile } = require("flex-tools/fs/nodefs");  

async function generateIdMap(allMessages){
    const { langDir,tasks,langRelDir } = this
    try{
        tasks.add([t("生成IDMap文件: {}"),`${langRelDir}/messages/idMap.json`])
        const idMapFile = path.join(langDir, "messages", "idMap.json")    
        const idMap = {}
        for(let [ text,translated ] of Object.entries(allMessages)){
            idMap[text] = translated.$id
        }
        const content = JSON.stringify(idMap,null,4)
        await writeFile(idMapFile,content,{ encoding: "utf-8" })
        tasks.complete()
    }catch(e){
        tasks.error(e)
    }
}
  
 
 

module.exports = {
    generateIdMap
}