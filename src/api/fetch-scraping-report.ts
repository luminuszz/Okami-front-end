import { compareDesc, parseISO } from 'date-fns'
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
      works.sort((a, b) =>
        compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt)),
      ),
    )
    .transform((works) =>
      works.map((work) => ({
        ...work,
        updatedAt: parseDistanceByDate(work.updatedAt),
      })),
    ),
})

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
