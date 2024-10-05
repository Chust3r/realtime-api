import { Hono } from 'hono'
import { messages } from './messages'

export const api = new Hono().basePath('/api')

api.route('/messages', messages)
