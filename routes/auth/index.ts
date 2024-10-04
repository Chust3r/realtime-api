import { Hono } from 'hono'
import { register } from './register'
import { login } from './login'

export const auth = new Hono().basePath('/auth')

auth.route('/', register)
auth.route('/', login)
