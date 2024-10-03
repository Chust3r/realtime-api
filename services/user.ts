import { schema } from '~drizzle/schema'
import { client } from '~db'
import { hash, verify } from 'argon2'

type UserSchema = {
	email: string
	password: string
}

//→ CLASS USER_SERVICE TO HANDLE ACTIONS ON USERS

class UserService {
	async emailExists(email: string) {
		try {
			const result = await client.query.users.findFirst({
				where: (user, { eq }) => eq(user.email, email),
			})

			return !!result
		} catch (e) {
			console.error('[UserService]: Error while checking if email exists', e)
			throw new Error('[UserService]: Error while checking if email exists')
		}
	}

	private async hashPassword(password: string) {
		try {
			const hashedPassword = await hash(password)

			return hashedPassword
		} catch (e) {
			console.error('[UserService]: Error while hashing password', e)
			throw new Error('[UserService]: Error while hashing password')
		}
	}

	async create(data: UserSchema) {
		const hashedPassword = await this.hashPassword(data.password)

		try {
			const [user] = await client
				.insert(schema.users)
				.values({
					email: data.email,
					password: hashedPassword,
				})
				.returning({
					id: schema.users.id,
					email: schema.users.email,
				})

			return user
		} catch (e) {
			console.error('[UserService]: Error Creating User', e)
			throw new Error('[UserService]: Error Creating User')
		}
	}
}

export const user = new UserService()
