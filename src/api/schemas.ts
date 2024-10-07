import { z } from 'zod'

import { workSchema } from './fetch-for-works-with-filter'

export const notificationSchema = z.object({
  content: z.object({
    chapter: z.number(),
    imageUrl: z.string(),
    message: z.string(),
    name: z.string(),
    url: z.string(),
    nextChapter: z.number().optional().default(0),
    workId: z.string().optional(),
  }),
  createdAt: z.string(),
  id: z.string(),
  readAt: z.string().nullable(),
})

export type NotificationType = z.infer<typeof notificationSchema>
export type WorkType = z.infer<typeof workSchema>
