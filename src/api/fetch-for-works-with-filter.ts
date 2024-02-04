import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const fetchWorksWithFilterSchema = z.object({
  filter: z.enum(['unread', 'read']),
})

const fetchWorksWithFilterOutputSchema = z.array(
  z.object({
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
  }),
)

export async function fetchWorksWithFilter(filter: string) {
  const parsed = fetchWorksWithFilterSchema.parse({ filter })

  const { data } = await okamiHttpGateway.get(
    `/work/fetch-for-workers-${parsed.filter}`,
  )

  return fetchWorksWithFilterOutputSchema.parse(data)
}
