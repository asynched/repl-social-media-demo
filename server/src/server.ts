import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { logger } from '@/services/logger'
import { auth } from '@/auth'
import { posts } from '@/posts'
import { repl } from './services/repl'

const server = new Hono()

repl
  .create('posts')
  .catch((err) => console.error('Failed to create topic, error:', err))

server
  .use('*', cors())
  .use('*', async (c, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    const hasAuth = !!(c.var as any)?.user

    logger.info(
      `method=${c.req.method} url=${c.req.path} time=${ms}ms status=${c.res.status} auth=${hasAuth}`,
    )
  })
  .route('/auth', auth)
  .route('/posts', posts)
  .get('/health', (c) => c.json({ message: 'up' }))

serve(
  {
    fetch: server.fetch,
    hostname: 'localhost',
    port: 3000,
  },
  (addr) => {
    logger.info(`Server listening on http://${addr.address}:${addr.port}`),
      logger.info(
        `Check health status on http://${addr.address}:${addr.port}/health`,
      )
  },
)
