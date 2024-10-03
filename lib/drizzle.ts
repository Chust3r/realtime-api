import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { schema } from '~drizzle/schema'
import { DATABASE_URL } from '~consts'

const pool = new Pool({
	connectionString: DATABASE_URL,
})

export const client = drizzle(pool, {
	schema,
})
