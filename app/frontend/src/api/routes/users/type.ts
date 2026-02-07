import type { editUserRequestSchema } from 'backend/src/routes/users/schema'
import type z from 'zod'

type UpdateUserRequestSchema = z.infer<typeof editUserRequestSchema>

export type { UpdateUserRequestSchema }
