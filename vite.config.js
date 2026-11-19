import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function overlayBridgePlugin() {
  const sseClients = new Set()
  let lastEngineConfig = {
    type: 'ENGINE_CONFIG',
    graphicsEngine: true,
    alignmentGrid: false
  }

  return {
    name: 'streamtroll-overlay-bridge',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1')
        const url = parsedUrl.pathname
        if (url !== '/events' && url !== '/dispatch' && url !== '/tikfinity' && url !== '/webhook') return next()

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method === 'GET' && url === '/events') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          })
          res.write(`data: ${JSON.stringify(lastEngineConfig)}\n\n`)
          sseClients.add(res)
          req.on('close', () => sseClients.delete(res))
          return
        }

        if (url === '/tikfinity' || url === '/webhook') {
          if (req.method === 'GET') {
            const queryObj = Object.fromEntries(parsedUrl.searchParams.entries())
            const msg = `data: ${JSON.stringify({ type: 'TIKFINITY_BRIDGE', payload: queryObj })}\n\n`
            for (const client of sseClients) {
              try { client.write(msg) } catch { sseClients.delete(client) }
            }
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, bridge: 'StreamTroll TikFinity Webhook Ready' }))
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const payload = body ? JSON.parse(body) : Object.fromEntries(parsedUrl.searchParams.entries())
                const msg = `data: ${JSON.stringify({ type: 'TIKFINITY_BRIDGE', payload })}\n\n`
                for (const client of sseClients) {
                  try { client.write(msg) } catch { sseClients.delete(client) }
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: true }))
              } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false }))
              }
            })
            return
          }
        }

        if (req.method === 'POST' && url === '/dispatch') {
          let body = ''
          req.on('data', (chunk) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const payload = JSON.parse(body)
              if (payload.type === 'ENGINE_CONFIG') {
                lastEngineConfig = { ...lastEngineConfig, ...payload }
              }
              const msg = `data: ${JSON.stringify(payload)}\n\n`
              for (const client of sseClients) {
                try { client.write(msg) } catch { sseClients.delete(client) }
              }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, clients: sseClients.size }))
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: false }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), overlayBridgePlugin()],
  base: process.env.VERCEL ? '/' : './',
})
