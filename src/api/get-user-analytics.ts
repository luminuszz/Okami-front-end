import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const analyticsSchema = z.object({
  totalOfWorksCreated: z.number(),
  totalOfWorksFinished: z.number(),
  totalOfWorksRead: z.number(),
  totalOfWorksUnread: z.number(),
})

export type UserAnalytics = z.infer<typeof analyticsSchema>

export async function getUserAnalytics() {
  const response = await okamiHttpGateway.get('auth/user/analytics')

  return analyticsSchema.parse(response.data)
}
