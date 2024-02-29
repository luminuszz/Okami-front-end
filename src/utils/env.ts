import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_STRIPE_PUBLIC_KEY: z.string(),
  VITE_DEFAULT_WORK_IMAGE: z.string(),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(import.meta.env) as Env
