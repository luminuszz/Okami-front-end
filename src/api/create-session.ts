import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'
import { storageService } from '@/lib/storage'

const createSessionInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>

export type CreateSessionOutput = {
  refreshToken: string
}

export async function createSession(payload: CreateSessionInput) {
  const parsed = createSessionInputSchema.parse(payload)

  const { data } = await okamiHttpGateway.post<CreateSessionOutput>(
    '/auth/v2/login',
    parsed,
  )

  const { refreshToken } = data

  storageService.set('okami-refresh-token', refreshToken)
}
