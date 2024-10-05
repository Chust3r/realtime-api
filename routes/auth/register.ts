import { Hono } from 'hono'
import { Validator } from '~services/validator'
import { User } from '~services/user'
import { JWT } from '~services/jwt'
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

		const { isValid, data } = Validator.validate('register', body)

		if (!isValid || !data) {
			return ErrorResponse(400, 'Validation Error')
		}

		const emailExists = await User.emailExists(data.email)

		if (emailExists) {
			return ErrorResponse(409, 'Email Already Exists', {
				email: data.email,
			})
		}

		const newUser = await User.create(data)

		//→ TODO:SEND EMAIL TO VERIFY ACCOUNT

		//→ CREATE JWT TOKEN

		const RLAT = await JWT.sign('RLAT', newUser)

		const RLRT = await JWT.sign('RLRT', newUser)

		//→ SET COOKIES

		setCookie(c, 'RLAT', RLAT, {
			httpOnly: true,
		})

		setCookie(c, 'RLRT', RLRT, {
			httpOnly: true,
		})

		return SuccessResponse(c, 201, 'OK')
	} catch (e) {
		return ErrorResponse(500, 'Internal Server Error')
	}
})
