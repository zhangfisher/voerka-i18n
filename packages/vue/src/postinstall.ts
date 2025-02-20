/**
 * 在安装后在项目自动引入组件
 */


import { getLanguageDir } from "@voerkai18n/utils"
import path  from "node:path"
import fs  from "node:fs"

const langDir = getLanguageDir({autoCreate:false})

const compoent = path.join(langDir,"component.ts")

console.log("langDir=",langDir)
