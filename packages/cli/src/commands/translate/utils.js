const { getBackupFile } = require("@voerkai18n/utils")

function backupFile(file){
    const bakFile = getBackupFile(file)
    fs.copyFileSync(file,bakFile)
} 



module.exports = {
    backupFile
}