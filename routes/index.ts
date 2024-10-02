import { Hono } from 'hono'
import { auth } from './auth'

export const routes = new Hono()

routes.route('/', auth)
