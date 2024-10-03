import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

//→ USERS TABLE

export const users = pgTable('USERS', {
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

export const refresh_tokens = pgTable('REFRESH_TOKENS', {
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
