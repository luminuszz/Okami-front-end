import { z } from 'zod'

import { tagSchema } from '@/api/get-tags-paged.ts'
import { okamiHttpGateway } from '@/lib/axios.ts'

const tagsResponseSchema = z.array(tagSchema)

export type TagResults = z.infer<typeof tagsResponseSchema>

export async function filterTagsBySearch(search: string) {
  const response = await okamiHttpGateway.get('/tags/filter', {
    params: {
      search,
    },
  })

  return tagsResponseSchema.parse(response.data)
}
