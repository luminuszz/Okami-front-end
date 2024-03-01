import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const responseSchema = z.object({
  isSubscribed: z.boolean(),
})

export async function checkTelegramIntegration() {
  const response = await okamiHttpGateway.get('/auth/user/telegram-status')

  return responseSchema.parseAsync(response.data)
}
