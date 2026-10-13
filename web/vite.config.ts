/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/** Server-side variables the API functions read (never exposed to the page). */
const SERVER_ENV = /^(TYPESAFE_|UPSTASH_|KV_)/

/**
 * Serves api/*.ts during `npm run dev` the way Vercel does in production, so Battle Rap
 * can be played locally without the Vercel CLI. Put TYPESAFE_API_KEY in .env.local
 * (gitignored) to judge bars with Jev; without it bars are scored on rhyme alone.
 */
function localApi(): Plugin {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '')
      for (const [key, value] of Object.entries(env)) {
        if (SERVER_ENV.test(key) && process.env[key] === undefined) process.env[key] = value
      }

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const route = /^\/api\/([\w-]+)$/.exec(url.pathname)?.[1]
        if (!route) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${route}.ts`)
          const handler = mod[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            res.end()
            return
          }
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
          const request = new Request(url, {
            method: req.method ?? 'GET',
            headers,
            ...(hasBody ? { body: Buffer.concat(chunks) } : {}),
          })
          const response: Response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            res.setHeader(key, value)
          })
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
  test: {
    include: ['test/**/*.test.ts'],
  },
})
