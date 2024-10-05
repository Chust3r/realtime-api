import type { Context, Next } from 'hono'
import { JWT } from '~services/jwt'
import { getCookie, setCookie } from 'hono/cookie'
import { ErrorResponse } from '~lib/response'
import { User } from '~services/user'

interface IPayload {
	id: string
	email: string
}

export const authMiddleware = async (c: Context, next: Next) => {
	const RLAT = getCookie(c, 'RLAT') || ''
	const RLRT = getCookie(c, 'RLRT') || ''

	const access_token = await JWT.verify('RLAT', RLAT)
	const refresh_token = await JWT.verify<IPayload, 'RLRT'>('RLRT', RLRT)

	//→ IF ACCESS TOKEN AND REFRESH TOKEN ARE INVALID  RETURN UNAUTHORIZED

	if (!access_token.isValid && !refresh_token.isValid) {
		return ErrorResponse(401, 'Unauthorized')
	}

	//→ IF ACCESS TOKEN IS INVALID BUT REFRESH TOKEN IS VALID CREATE NEW ACCESS TOKEN

	if (!access_token.isValid && refresh_token.isValid) {
		const user = await User.getUserById(refresh_token.data?.id as string)

		if (!user) {
			return ErrorResponse(401, 'Unauthorized')
		}

		//→ CREATE A NEW JWT AND REFRESH IT

		const new_access_token = await JWT.sign('RLAT', {
			id: user.id,
			email: user.email,
		})

		const new_refresh_token = await JWT.sign('RLRT', {
			id: user.id,
			email: user.email,
		})

		//→ SET COOKIE

		setCookie(c, 'RLAT', new_access_token, {
			httpOnly: true,
		})

		setCookie(c, 'RLRT', new_refresh_token, {
			httpOnly: true,
		})
	}

	next()
}
