import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'
import { parseDistanceByDate } from '@/lib/utils'

import { WorkSchema } from './schemas'

const parser = {
  PENDING: 'Pendente',
  SUCCESS: 'Sincronizado',
  FAILED: 'Falhou',
}

const scrappingReportSchema = z.object({
  totalOfPages: z.number(),
  data: z
    .array(
      WorkSchema.extend({
        refreshStatus: z
          .enum(['PENDING', 'SUCCESS', 'FAILED'])
          .nullable()
          .transform((value) => parser?.[value || 'PENDING']),
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
}

export async function fetchScrappingReport({ page }: Params) {
  const { data } = await okamiHttpGateway.get(
    '/work/fetch-for-works-scraping-report',
    {
      params: {
        page,
      },
    },
  )

  return await scrappingReportSchema.parseAsync(data)
}
