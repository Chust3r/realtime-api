type SuccessResponse<T> = {
	status: 'success'
	message: string
	data?: T
}

type ErrorResponse = {
	status: 'error'
	message: string
	error_code: string
	details?: Record<string, string>
}

const HTTP_CODES = {
	200: 'OK',
	201: 'CREATED',
	400: 'BAD_REQUEST',
	401: 'UNAUTHORIZED',
	403: 'FORBIDDEN',
	404: 'NOT_FOUND',
	405: 'METHOD_NOT_ALLOWED',
	409: 'CONFLICT',
	500: 'INTERNAL_SERVER_ERROR',
} as const

type T_HTTP_CODES = typeof HTTP_CODES
type T_HTTP_CODE = keyof T_HTTP_CODES

export const SuccessResponse = <T>(
	code: T_HTTP_CODE,
	message: string,
	data?: T
) => {
	const res: SuccessResponse<T> = {
		status: 'success',
		message,
		data,
	}

	return Response.json(res, {
		status: code,
		statusText: HTTP_CODES[code],
	})
}

export const ErrorResponse = (
	code: T_HTTP_CODE,
	errorCode: string,
	details?: Record<string, string>
) => {
	const res: ErrorResponse = {
		status: 'error',
		message: HTTP_CODES[code],
		error_code: errorCode,
		details,
	}

	return Response.json(res, {
		status: code,
		statusText: HTTP_CODES[code],
	})
}
