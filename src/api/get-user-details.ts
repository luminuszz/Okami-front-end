import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const getUserDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarImageUrl: z.string().url().nullable(),
  avatarImageId: z.string(),
  finishedWorksCount: z.number(),
  readingWorksCount: z.number(),
  paymentSubscriptionStatus: z.enum(['ACTIVE', 'INACTIVE']),
  notionDatabaseId: z.string().nullable(),
})

export type GetUserDetailsType = z.infer<typeof getUserDetailsSchema>

export async function getUserDetails() {
  const { data } =
    await okamiHttpGateway.get<GetUserDetailsType>('/auth/user/me')

  return getUserDetailsSchema.parse(data)
}
