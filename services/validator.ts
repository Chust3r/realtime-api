import { object, string, email, minLength, pipe, safeParse } from 'valibot'
import type { InferInput } from 'valibot'

//→ VALIDATE SCHEMAS

const registerSchema = object({
	email: pipe(string(), email()),
	password: pipe(string(), minLength(6)),
})

const loginSchema = object({
	email: pipe(string(), email()),
	password: pipe(string(), minLength(6)),
})

//→ VALIDATE RESULT TYPE

interface IValidateResult<T> {
	isValid: boolean
	errors?: string[]
	data?: T
}

//→ SCHEMA MAP

const schemaMap = {
	register: registerSchema,
	login: loginSchema,
} as const

//→ DYNAMIC TYPES FOR SCHEMAS

type SchemaMap = typeof schemaMap
type SchemaKeys = keyof SchemaMap
type InferSchemaType<K extends SchemaKeys> = InferInput<SchemaMap[K]>

//→ VALIDATOR CLASS

class ValidatorService {
	private getSchema<K extends SchemaKeys>(type: K): SchemaMap[K] {
		const schema = schemaMap[type]

		if (!schema) {
			throw new Error(`No validation schema found for: ${type}`)
		}

		return schema
	}

	public validate<K extends SchemaKeys>(
		type: K,
		body: object
	): IValidateResult<InferSchemaType<K>> {
		try {
			const schema = this.getSchema(type)

			const result = safeParse(schema, body)

			if (!result.success) {
				return {
					isValid: false,
					errors: result.issues.flatMap((issue) => issue.message),
				}
			}

			return {
				isValid: true,
				data: result.output as InferSchemaType<K>,
			}
		} catch (e) {
			return {
				isValid: false,
				errors: [String(e)],
			}
		}
	}
}

export const Validator = new ValidatorService()
