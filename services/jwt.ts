import { SignJWT, jwtVerify } from 'jose'
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '~consts'

const jwtMap = {
	RLAT: {
		expiresIn: JWT_EXPIRES_IN,
		secret: JWT_SECRET,
	},
	RLRT: {
		expiresIn: JWT_REFRESH_EXPIRES_IN,
		secret: JWT_SECRET,
	},
} as const

type JWTMap = typeof jwtMap
type JWTKeys = keyof JWTMap

type JWTVerifyResult<T> = {
	isValid: boolean
	data?: T
	error?: string
}

class JWTService {
	//→ SIGN JWT
	async sign<K extends JWTKeys>(type: K, payload: Record<string, unknown>) {
		try {
			const config = jwtMap[type]

			if (!config) {
				throw new Error(`[JWTService]: No config found for ${type}`)
			}

			const secret = new TextEncoder().encode(config.secret)

			const token = await new SignJWT(payload)
				.setProtectedHeader({
					alg: 'HS256',
				})
				.setIssuedAt()
				.setExpirationTime(config.expiresIn)
				.sign(secret)

			return token
		} catch (e) {
			throw new Error('[JWTService]: Error signing token')
		}
	}

	//→ VERIFY JWT

	async verify<T, K extends JWTKeys>(
		type: K,
		token: string
	): Promise<JWTVerifyResult<T>> {
		try {
			const config = jwtMap[type]

			if (!config) {
				throw new Error(`[JWTService]: No config found for ${type}`)
			}

			const secret = new TextEncoder().encode(config.secret)

			const { payload } = await jwtVerify(token, secret)

			return {
				isValid: true,
				data: payload as T,
			}
		} catch (e) {
			return {
				isValid: false,
				error: '[JWTService]: Error verifying token',
			}
		}
	}
}

export const JWT = new JWTService()
