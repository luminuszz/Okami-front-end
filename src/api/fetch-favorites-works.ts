import { z } from 'zod'

import { workSchema } from '@/api/fetch-for-works-with-filter.ts'
import { okamiHttpGateway } from '@/lib/axios.ts'

export async function fetchFavoritesWorks() {
  const response = await okamiHttpGateway.get('/work/favorites')

  return z.array(workSchema).parse(response.data)
}
