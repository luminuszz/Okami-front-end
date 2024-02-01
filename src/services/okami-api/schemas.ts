import { z } from 'zod'

export const getUserDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarImageUrl: z.string().url(),
  avatarImageId: z.string(),
  finishedWorksCount: z.number(),
  readingWorksCount: z.number(),
})

export type GetAuthTokenInput = {
  email: string
  password: string
}

export type GetUserDetailsSchemaType = z.infer<typeof getUserDetailsSchema>
