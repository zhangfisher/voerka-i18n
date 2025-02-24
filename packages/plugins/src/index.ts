import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin' 
import { applyIdMap, getLanguageDir } from "@voerkai18n/utils"
import viteConfig from "./vite/config"
import path from 'node:path'
import fs from 'node:fs'


export const unpluginFactory: UnpluginFactory<Options | undefined> = options => {

  const { debug, patterns } = Object.assign({
    debug:false,
    patterns:[/.(js|mjs|cjs|ts|jsx|tsx|vue|svelte|mdx|astro)$/]
  },options)
  const langDir = getLanguageDir()
  const projectDir = process.cwd()
  
  if(!langDir){
    console.warn("VoerkaI18n is not availabled.")
  }

  const idMapFile = path.join(langDir, 'idMap.json')
  const idMap = JSON.parse(fs.readFileSync(idMapFile, 'utf-8'))


  return ({
    name: 'voerkai18n-plugins',
    transformInclude(id) {
      if(/node_modules\//.test(id)) return false
      const isMatched = patterns.some(pattern => {
          if (pattern && pattern instanceof RegExp) {
            return pattern.test(id)
          } else if(typeof(pattern)==='string'){
            return id.endsWith(pattern)
          }else{
            return false
          }
        })    
      if(debug && isMatched) console.log(`[VoerkaI18n] apply ${id}`)
      return isMatched 
    },
    transform(code) {
      if(!idMap) return 
      try{
        return applyIdMap(code,idMap)
      }
      catch(e){
        console.warn("Error while applyIdMap: ",e)
      }
    },
    vite: viteConfig 
  })
}


export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
