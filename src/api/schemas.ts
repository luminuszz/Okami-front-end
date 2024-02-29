import { z } from 'zod'

import { workSchema } from './fetch-for-works-with-filter'

export type WorkType = z.infer<typeof workSchema>
