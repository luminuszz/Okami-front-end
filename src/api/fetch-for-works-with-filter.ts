import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const fetchWorksWithFilterSchema = z.object({
  status: z.enum(['unread', 'read', 'dropped', 'finished']).optional(),
})

type FetchWorksWithFilterInput = z.infer<typeof fetchWorksWithFilterSchema>

export type FilterStatus = FetchWorksWithFilterInput['status']

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

export async function fetchWorksWithFilter(filter: FetchWorksWithFilterInput) {
  const params = fetchWorksWithFilterSchema.parse(filter)

  const { data } = await okamiHttpGateway.get('/work/list', {
    params,
  })

  return fetchWorksWithFilterOutputSchema.parse(data)
}
