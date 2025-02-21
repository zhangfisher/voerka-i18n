/**
 * 在安装后在项目自动引入组件
 */


import { getLanguageDir } from "@voerkai18n/utils"
import path  from "node:path"
import { copyFiles } from "flex-tools/fs/copyFiles"

const langDir = getLanguageDir({ 
    autoCreate:false
})

copyFiles("*.*",langDir,{
    overwrite: false,
    cwd      : path.join(__dirname,"templates")
})

console.log("@voerkai18n/vue component is installed: ",langDir)
