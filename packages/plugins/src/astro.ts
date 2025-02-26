import type { VoerkaI18nPluginOptions } from './types'

import unplugin from '.'

export default (options: VoerkaI18nPluginOptions): any => ({
  name: 'unplugin-starter',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
