import { z } from 'zod'

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

export type WorkType = z.infer<typeof WorkSchema>