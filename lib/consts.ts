import 'dotenv/config'

export const DATABASE_URL = process.env.DATABASE_URL as string

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'

export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
