import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'

export interface Options {
  // define your plugin options here
  a:1
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: '@voerkai18n/vite',
  // webpack's id filter is outside of loader logic,
  // an additional hook is needed for better perf on webpack
  transformInclude(id) {
    return id.endsWith('main.ts')
  },
  // just like rollup transform
  transform(code) {
    return code.replace(/<template>/, '<template><div>Injected</div>')
  }, 
  vite:{
    configureServer(server) {
      // 接收传入的请求数据包：{language:string,scope,message:string,id:string}
      server.middlewares.use('/api/voerkai18n/patch', (req, res) => {
        const patch = req.body
        // patch language message
      

        res.end('Hello World')
      })
    }
  }
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin