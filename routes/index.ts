import { Hono } from 'hono'
import { auth } from './auth'
import { api } from './api'

export const routes = new Hono()

routes.route('/', auth)

routes.route('/', api)
