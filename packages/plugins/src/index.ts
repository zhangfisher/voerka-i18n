import type { UnpluginFactory } from 'unplugin'
import type { VoerkaI18nPluginOptions } from './types'
import fs from 'node:fs'
import path from 'node:path'
import { addImport, applyIdMap, getLanguageDir } from '@voerkai18n/utils'
import { createUnplugin } from 'unplugin'
import getViteConfig from './vite/config'

export const unpluginFactory: UnpluginFactory<VoerkaI18nPluginOptions | undefined> = (
  options,
) => {
  const opts: Required<VoerkaI18nPluginOptions> = Object.assign(
    {
      autoImport: false,
      debug: false,
      patchUrl: '/api/voerkai18n/patch',
      patterns: [/.(js|mjs|cjs|ts|jsx|tsx|vue|svelte|mdx|astro)$/],
    },
    options,
  )

  const { debug, patterns } = opts
  const langDir = getLanguageDir()

  if (!langDir) {
    console.warn('VoerkaI18n is not availabled.')
  }

  const idMapFile = path.join(langDir, 'messages', 'idMap.json')
  const idMap = JSON.parse(fs.readFileSync(idMapFile, 'utf-8'))

  return {
    name: 'voerkai18n-plugins',
    transformInclude(id) {
      if (/node_modules\//.test(id)) return false

      const isMatched = patterns.some((pattern) => {
        if (pattern && pattern instanceof RegExp) {
          return pattern.test(id)
        }
        else if (typeof pattern === 'string') {
          return id.endsWith(pattern)
        }
        else {
          return false
        }
      })

      if (debug && isMatched) console.log(`[VoerkaI18n] apply ${id}`)

      return isMatched
    },
    transform(code) {
      if (!idMap) return
      try {
        let codeResult = applyIdMap(code, idMap)
        // 自动导入t函数
        if (opts.autoImport) {
          const fromModule = typeof (opts.autoImport) === 'string' ? opts.autoImport : '@/languages'
          codeResult = addImport(code, fromModule, 't')
        }
        return codeResult
      }catch (e) {
        console.warn('Error while applyIdMap: ', e)
      }
    },
    vite: getViteConfig(opts)
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
