import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const getAuthTokenInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const getAuthTokenOutputSchema = z.object({
  token: z.string(),
})

export type GetAuthTokenInput = z.infer<typeof getAuthTokenInputSchema>

export async function getAuthToken(payload: GetAuthTokenInput) {
  const parsed = getAuthTokenInputSchema.parse(payload)

  const { data } = await okamiHttpGateway.post<{ token: string }>(
    '/auth/login',
    parsed,
  )

  return getAuthTokenOutputSchema.parse(data)
}
