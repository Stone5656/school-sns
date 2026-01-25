import type z from 'zod'
import type { getScrapsQuerySchema } from 'backend/src/routes/scraps/schema'

type GetScrapsQuerySchema = z.infer<typeof getScrapsQuerySchema>

export type { GetScrapsQuerySchema }
