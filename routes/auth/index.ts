import { Hono } from 'hono'
import { register } from './register'

export const auth = new Hono().basePath('/auth')

auth.route('/', register)
