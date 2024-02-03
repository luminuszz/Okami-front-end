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

export const WorkSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  hasNewChapter: z.boolean(),
  chapter: z.number(),
  isFinished: z.boolean(),
  imageId: z.string(),
  imageUrl: z.string(),
  updatedAt: z.string(),
  category: z.enum(['ANIME', 'MANGA']),
  nextChapterUpdatedAt: z.string().nullable(),
  nextChapter: z.number().nullable(),
  isDropped: z.boolean(),
})

export const getWorksResponse = z.array(WorkSchema)

export type GetAuthTokenInput = {
  email: string
  password: string
}

export type MarkWorkReadInput = {
  workId: string
  chapter: number
}

export type Work = z.infer<typeof WorkSchema>

export type GetUserDetailsSchemaType = z.infer<typeof getUserDetailsSchema>
