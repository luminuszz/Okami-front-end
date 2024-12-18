import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

import { workSchema } from './fetch-for-works-with-filter'

const fetchWorksWithFilterPageParamsSchema = z.object({
  status: z
    .enum(['unread', 'read', 'dropped', 'finished', 'favorites'])
    .nullable(),
  search: z.string().optional().nullable(),
  page: z.number().positive().min(1),
  limit: z.literal(10).or(z.literal(20)).or(z.literal(30)),
})

const fetchWorksWithFilterPageResponse = z.object({
  nextPage: z.number().nullable(),
  totalOfPages: z.number().int(),
  works: z.array(workSchema),
})

export type FetchWorksWithFilterPageParams = z.infer<
  typeof fetchWorksWithFilterPageParamsSchema
>

export async function fetchForWorksWithPageFilterPaged(
  params: FetchWorksWithFilterPageParams,
) {
  const parsedParams = fetchWorksWithFilterPageParamsSchema.parse(params)

  console.log({ parsedParams })

  const response = await okamiHttpGateway.get('/work/list/paged', {
    params: parsedParams,
  })

  return fetchWorksWithFilterPageResponse.parse(response.data)
}
