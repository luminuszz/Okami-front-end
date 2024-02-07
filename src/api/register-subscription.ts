import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const registerSubscriptionSchema = z.object({
  endpoint: z.string(),
  auth: z.string(),
  p256dh: z.string(),
})

type RegisterSubscriptionInput = z.infer<typeof registerSubscriptionSchema>

export async function registerSubscription(payload: RegisterSubscriptionInput) {
  await okamiHttpGateway.post('/notification/push/browser/subscribe', payload)
}
