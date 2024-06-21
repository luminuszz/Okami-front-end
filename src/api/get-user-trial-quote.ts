import { useQuery, UseQueryOptions } from '@tanstack/react-query'
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

export const getUserTrialQuoteKey = getUserTrialQuote.name

export function useGetUserTrialQuote(props?: UseQueryOptions) {
  return useQuery({
    queryFn: getUserTrialQuote,
    queryKey: [getUserTrialQuoteKey],
    ...props,
  })
}
