import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'

export interface Options {
  // define your plugin options here
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-starter',
  // webpack's id filter is outside of loader logic,
  // an additional hook is needed for better perf on webpack
  transformInclude(id) {
    return id.endsWith('main.ts')
  },
  // just like rollup transform
  transform(code) {
    return code.replace(/<template>/, '<template><div>Injected</div>')
  },
  // more hooks coming
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

export const vitePlugin = unplugin.vite
export const rollupPlugin = unplugin.rollup
export const rolldownPlugin = unplugin.rolldown
export const webpackPlugin = unplugin.webpack
export const rspackPlugin = unplugin.rspack
export const esbuildPlugin = unplugin.esbuild
export const farmPlugin = unplugin.farm