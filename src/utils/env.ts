import * as process from 'node:process'

import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_STRIPE_PUBLIC_KEY: z.string(),
  VITE_DEFAULT_WORK_IMAGE: z.string(),
  VITE_IS_DEV: z.coerce.boolean().optional().default(false),
})

export type Env = z.infer<typeof envSchema>

export const getEnv = () => {
  const env = envSchema.safeParse(process.env)

  if (!env.success) {
    console.error('Missing environment variables: ', env.error)
    return process.env as unknown as Env
  }

  return env.data
}

export const env = getEnv()
