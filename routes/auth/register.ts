import { Hono } from 'hono'
import { validator } from '~services/validator'
import { user } from '~services/user'
import { jwt } from '~services/jwt'
import { SuccessResponse, ErrorResponse } from '~lib/response'
import { setCookie } from 'hono/cookie'

export const register = new Hono()

register.post('/register', async (c) => {
	try {
		let body: Record<string, string> = {}

		//→ TRY PARSING BODY TO JSON

		try {
			body = await c.req.json()
		} catch (e) {
			return ErrorResponse(400, 'Invalid Request Body', {
				message: 'Body must be in JSON format',
			})
		}

		const { isValid, data } = validator.validate('register', body)

		if (!isValid || !data) {
			return ErrorResponse(400, 'Validation Error')
		}

		const emailExists = await user.emailExists(data.email)

		if (emailExists) {
			return ErrorResponse(409, 'Email Already Exists', {
				email: data.email,
			})
		}

		const newUser = await user.create(data)

		//→ TODO:SEND EMAIL TO VERIFY ACCOUNT

		//→ CREATE JWT TOKEN

		const token = await jwt.sign('access', newUser)

		const refreshToken = await jwt.sign('refresh', newUser)

		//→ SET COOKIES

		setCookie(c, 'RLAT', token, {
			httpOnly: true,
		})

		setCookie(c, 'RLRT', refreshToken, {
			httpOnly: true,
		})

		return SuccessResponse(c, 201, 'OK')
	} catch (e) {
		return ErrorResponse(500, 'Internal Server Error')
	}
})
