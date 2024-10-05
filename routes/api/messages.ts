import { Hono } from 'hono'
import { authMiddleware } from '~middlewares/auth'

export const messages = new Hono()

messages.use(authMiddleware)

messages.get('/', (c) => {
	return c.json({ hello: 'world' })
})
