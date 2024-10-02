import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { routes } from '~routes'

const app = new Hono()

app.use('*', cors())

app.use(logger())

app.route('/', routes)

const port = 3000

console.log(`Server is running on port http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port,
})
