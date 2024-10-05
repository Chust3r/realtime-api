import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

//→ ENUMS

export const messageType = pgEnum('MESSAGE_TYPE', [
	'TEXT',
	'IMAGE',
	'VIDEO',
	'AUDIO',
	'FILE',
])

//→ USERS TABLE

export const users = pgTable('USERS', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
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
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	refresh_token: text('refresh_token').notNull().unique(),
	created_at: timestamp('created_at', {
		mode: 'date',
		precision: 3,
	}).defaultNow(),
})

//→ CONVERSATIONS TABLE

export const conversations = pgTable('CONVERSATIONS', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	is_group: boolean('is_group').notNull().default(false),
	name: text('name').notNull(),
	description: text('description').notNull().default(''),
	created_at: timestamp('created_at', {
		mode: 'date',
		precision: 3,
	}).defaultNow(),
	updated_at: timestamp('updated_at', {
		mode: 'date',
		precision: 3,
	}).$onUpdateFn(() => new Date()),
})

//→ PARTICIPANTS TABLE
export const participants = pgTable('PARTICIPANTS', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	conversation_id: text('conversation_id')
		.notNull()
		.references(() => conversations.id),
	joined_at: timestamp('joined_at', {
		mode: 'date',
		precision: 3,
	}).defaultNow(),
})

//→ MESSAGES TABLE

export const messages = pgTable('MESSAGES', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	conversation_id: text('conversation_id')
		.notNull()
		.references(() => conversations.id),
	sender_id: text('sender_id')
		.notNull()
		.references(() => participants.id),
	type: messageType('type').default('TEXT'),
	content: text('content').notNull(),
	created_at: timestamp('created_at', {
		mode: 'date',
		precision: 3,
	}),
	updated_at: timestamp('updated_at', {
		mode: 'date',
		precision: 3,
	}).$onUpdateFn(() => new Date()),
	is_edited: boolean('is_edited').notNull().default(false),
	is_deleted: boolean('is_deleted').notNull().default(false),
	attachment_url: text('attachment').notNull().default(''),
})

//→ RELATIONS AMONG TABLES

//→ A CONVERSATION HAS MULTIPLE PARTICIPANTS AND MULTIPLE MESSAGES

const conversationsRelations = relations(conversations, ({ many }) => ({
	participants: many(participants),
	messages: many(messages),
}))

//→ A USER HAS MULTIPLE CONVERSATIONS AND MULTIPLE MESSAGES

const usersRelations = relations(users, ({ many }) => ({
	conversations: many(conversations),
	messages: many(messages),
	refresh_tokens: many(refresh_tokens),
}))

//→ A PARTICIPANT HAS MULTIPLE MESSAGES AND ONE CONVERSATION

const participantsRelations = relations(participants, ({ one, many }) => ({
	conversation: one(conversations, {
		fields: [participants.conversation_id],
		references: [conversations.id],
	}),
	messages: many(messages),
}))

//→ SCHEMA

export const schema = {
	users,
	refresh_tokens,
	conversations,
	participants,
	messages,
	...conversationsRelations,
	...usersRelations,
	...participantsRelations,
}
