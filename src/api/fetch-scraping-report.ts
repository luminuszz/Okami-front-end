import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'
import { parseDistanceByDate } from '@/utils/helpers.ts'

import { workSchema } from './fetch-for-works-with-filter'

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
      workSchema.extend({
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
        updatedAt: parseDistanceByDate(work.updatedAt ?? work.createdAt),
      })),
    ),
})

export type ScrapingReportResponse = z.infer<typeof scrappingReportSchema>

export type ScrapingFilterStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

interface Params {
  page: number
  filter?: ScrapingFilterStatus
  search?: string
}

export async function fetchScrappingReport({ page, filter, search }: Params) {
  const { data } = await okamiHttpGateway.get(
    '/work/fetch-for-works-scraping-report',
    {
      params: {
        page,
        filter,
        search,
      },
    },
  )

  return await scrappingReportSchema.parseAsync(data)
}
