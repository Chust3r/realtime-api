import { defineConfig } from 'drizzle-kit'
import { DATABASE_URL } from '~consts'

export default defineConfig({
	dialect: 'postgresql',
	dbCredentials: {
		url: DATABASE_URL,
	},
	schema: './drizzle/schema.ts',
	out: './drizzle',
})
