import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios.ts'

const tagSchema = z.object({
  id: z.string(),
  color: z.string(),
  slug: z.string(),
  name: z.string(),
})

const tagResponse = z.object({
  data: z.array(tagSchema),
  totalOfPages: z.number(),
})

export type Tag = z.infer<typeof tagSchema>

export type TagResponse = z.infer<typeof tagResponse>

export async function getTagsPaged(page: number) {
  const response = await okamiHttpGateway.get('/tags', {
    params: {
      page,
    },
  })

  return tagResponse.parse(response.data)
}
