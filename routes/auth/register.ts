import { Hono } from 'hono'
import { validator } from '~services/validator'
import { user } from '~services/user'
import { jwt } from '~services/jwt'

export const register = new Hono()

register.post('/register', async (c) => {
	const { req, json } = c
	try {
		const body = await req.json()

		const { isValid, errors, data } = validator.validate('register', body)

		if (!isValid || !data) {
			return json({ ok: false, errors }, 400)
		}

		const emailExists = await user.emailExists(data.email)

		if (emailExists) {
			return json({ ok: false, errors: ['Email already in use'] }, 409)
		}

		const newUser = await user.create(data)

		//→ TODO:SEND EMAIL

		const token = await jwt.sign('access', newUser)

		const refreshToken = await jwt.sign('refresh', newUser)

		return json({ ok: true, token, refreshToken }, 201)
	} catch (e) {
		return json({ errors: ['Internal Server Error'] }, 500)
	}
})
