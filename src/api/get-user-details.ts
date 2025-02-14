import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const getUserDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarImageUrl: z.string().url().nullable(),
  avatarImageId: z.string().nullable(),
  finishedWorksCount: z.number(),
  readingWorksCount: z.number(),
  paymentSubscriptionStatus: z.enum(['ACTIVE', 'INACTIVE']),
  notionDatabaseId: z.string().nullable(),
  role: z.enum(['ADMIN', 'USER', 'SUBSCRIBED_USER']),
})

export type GetUserDetailsType = z.infer<typeof getUserDetailsSchema>

export async function getUserDetails() {
  const { data } =
    await okamiHttpGateway.get<GetUserDetailsType>('/auth/user/me')

  return getUserDetailsSchema.parse(data)
}
