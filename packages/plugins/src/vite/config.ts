import type { ViteDevServer } from "vite"

export default {
    configureServer(server:ViteDevServer){ 
        server.middlewares.use('/api', (req, res) => {
           res.setHeader('Content-Type', 'application/json')
           res.end(JSON.stringify({ a: 1 }))
        })
    }
}