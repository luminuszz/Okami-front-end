import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'
import { parseDistanceByDate } from '@/lib/utils'

import { WorkSchema } from './schemas'

const parser = {
  PENDING: 'Pendente',
  SUCCESS: 'Sincronizado',
  FAILED: 'Falhou',
  NO_STATUS: 'Sem Status',
}

const scrappingReportSchema = z.object({
  totalOfPages: z.number(),
  data: z
    .array(
      WorkSchema.extend({
        refreshStatus: z
          .enum(['PENDING', 'SUCCESS', 'FAILED', 'NO_STATUS'])
          .nullable()
          .default('NO_STATUS')
          .transform((value) => parser?.[value ?? 'NO_STATUS']),
      }),
    )
    .transform((works) =>
      works.map((work) => ({
        ...work,
        updatedAt: parseDistanceByDate(work.updatedAt),
      })),
    ),
})

export type ScrapingReportResponse = z.infer<typeof scrappingReportSchema>

interface Params {
  page: number
  filter?: 'PENDING' | 'SUCCESS' | 'FAILED'
}

export async function fetchScrappingReport({ page, filter }: Params) {
  const { data } = await okamiHttpGateway.get(
    '/work/fetch-for-works-scraping-report',
    {
      params: {
        page,
        filter,
      },
    },
  )

  return await scrappingReportSchema.parseAsync(data)
}
