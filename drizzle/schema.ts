import { pgSchema, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

const realtime = pgSchema('realtime')

//→ USERS TABLE

const users = realtime.table('USERS', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	created_at: timestamp('created_at', {
		mode: 'date',
		precision: 3,
	}).defaultNow(),
	updated_at: timestamp('updated_at', {
		mode: 'date',
		precision: 3,
	}).$onUpdateFn(() => new Date()),
})

//→ REFRESH TOKENS TABLE

const refresh_tokens = realtime.table('REFRESH_TOKENS', {
	id: serial('id').primaryKey(),
	refresh_token: text('refresh_token').notNull().unique(),
	created_at: timestamp('created_at', {
		mode: 'date',
		precision: 3,
	}).defaultNow(),
})

//→ SCHEMA

export const schema = {
	users,
	refresh_tokens,
}
