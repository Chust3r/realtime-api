import { Hono } from 'hono'
import { Validator } from '~services/validator'
import { User } from '~services/user'
import { JWT } from '~services/jwt'
import { SuccessResponse, ErrorResponse } from '~lib/response'
import { setCookie } from 'hono/cookie'

export const login = new Hono()

login.post('/login', async (c) => {
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

		//→ VALIDATE JSON BODY

		const { isValid, data } = Validator.validate('login', body)

		if (!isValid || !data) {
			return ErrorResponse(400, 'Validation Error')
		}

		//→ CHECK IF USER EXISTS

		const user = await User.getUser(data.email)

		if (!user) {
			return ErrorResponse(404, 'User Not Found')
		}

		//→ CHECK IF PASSWORD IS CORRECT

		const passwordIsCorrect = await User.verifyPassword(
			data.password,
			user.password
		)

		if (!passwordIsCorrect) {
			return ErrorResponse(401, 'Invalid Credentials')
		}

		//→ CREATE JWT TOKEN

		const RLAT = await JWT.sign('RLAT', {
			id: user.id,
			email: user.email,
		})

		const RLRT = await JWT.sign('RLRT', {
			id: user.id,
			email: user.email,
		})

		//→ SET COOKIES

		setCookie(c, 'RLAT', RLAT, {
			httpOnly: true,
		})

		setCookie(c, 'RLRT', RLRT, {
			httpOnly: true,
		})

		return SuccessResponse(c, 200, 'OK')
	} catch (e) {
		return ErrorResponse(500, 'Internal Server Error')
	}
})
