import { Hono } from 'hono'
import { validator } from '~services/validator'
import { user } from '~services/user'
import { jwt } from '~services/jwt'
import { SuccessResponse, ErrorResponse } from '~lib/response'

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

		const { isValid, data } = validator.validate('login', body)

		if (!isValid || !data) {
			return ErrorResponse(400, 'Validation Error')
		}

		//→ CHECK IF USER EXISTS

		const userExists = await user.getUser(data.email)

		if (!userExists) {
			return ErrorResponse(404, 'User Not Found')
		}

		//→ CHECK IF PASSWORD IS CORRECT

		const passwordIsCorrect = await user.verifyPassword(
			data.password,
			userExists.password
		)

		if (!passwordIsCorrect) {
			return ErrorResponse(401, 'Invalid Credentials')
		}

		//→ CREATE JWT TOKEN

		const token = await jwt.sign('access', {
			id: userExists.id,
			email: userExists.email,
		})

		const refreshToken = await jwt.sign('refresh', {
			id: userExists.id,
			email: userExists.email,
		})

		return SuccessResponse(200, 'Login Successful', {
			token,
			refreshToken,
		})
	} catch (e) {
		return ErrorResponse(500, 'Internal Server Error')
	}
})
