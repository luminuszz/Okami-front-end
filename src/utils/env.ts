import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_STRIPE_PUBLIC_KEY: z.string(),
  VITE_DEFAULT_WORK_IMAGE: z.string(),
  VITE_IS_DEV: z.string().or(z.coerce.boolean()).optional(),
})

export type Env = z.infer<typeof envSchema>

export const parseEnv = () => {
  const results = envSchema.safeParse(import.meta.env)

  if (results.success) return results.data

  console.log({ error: results.error.errors })

  throw new Error(results.error.errors.join('\n'))
}

export const env = parseEnv()
