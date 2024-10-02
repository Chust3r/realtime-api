import { Hono } from 'hono'

export const register = new Hono()

register.post('/register', () => {
	return Response.json({ message: 'Hello Hono!' })
})
