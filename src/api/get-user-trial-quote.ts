import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const getUserTrialQuoteSchema = z.object({
  quote: z.number(),
  remainingQuotas: z.number(),
  limit: z.number(),
})

export async function getUserTrialQuote() {
  const response = await okamiHttpGateway.get('/auth/user/trial-quote')

  return getUserTrialQuoteSchema.parseAsync(response.data)
}
