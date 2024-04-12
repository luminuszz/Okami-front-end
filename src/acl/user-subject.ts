import { z } from 'zod'

export const userSubject = z.object({
  id: z.string().uuid(),
  kind: z.literal('User'),
  paymentSubscriptionStatus: z.enum(['ACTIVE', 'INACTIVE']),
  trialQuoteLimit: z.number(),
  isTelegramSubscriber: z.boolean(),
  notionDatabaseId: z.string().nullable(),
})

export type UserSubject = z.infer<typeof userSubject>
