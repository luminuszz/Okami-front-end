import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const searchTokenTypeSchema = z.enum(['ANIME', 'MANGA'])

type SearchtokenType = z.infer<typeof searchTokenTypeSchema>

const searchTokenSchema = z.object({
  token: z.string(),
  createdAt: z.coerce.date(),
  id: z.string(),
  type: searchTokenTypeSchema,
})

type SearchToken = z.infer<typeof searchTokenSchema>

export async function getSearchTokenByType(type: SearchtokenType) {
  const response = await okamiHttpGateway.get('/search-token', {
    params: {
      type,
    },
  })

  return z.array(searchTokenSchema).parse(response.data)
}

export type { SearchToken, SearchtokenType }
