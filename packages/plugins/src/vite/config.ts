import type { ViteDevServer } from 'vite'
import type { VoerkaI18nPluginOptions } from '../types'

export default (options: VoerkaI18nPluginOptions): any => {
  return ({
    configureServer(server: ViteDevServer) {
      server.middlewares.use(options.patchUrl!, (req, res) => {        
        let body = ''
        req.on('data', chunk => {
          body += chunk.toString()
        })
        req.on('end', () => {
          const patchData = JSON.parse(body)
          if(options.debug) console.log('[VoerkaI18n] submit language patch=', patchData)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ a: 1 }))
        }) 
      })
    }
  })
}
