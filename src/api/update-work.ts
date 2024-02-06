import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const updateWorkSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  url: z.string().url().optional(),
  chapter: z.number().optional(),
})

type UpdateWorkInput = z.infer<typeof updateWorkSchema>

export async function updateWork({ id, ...data }: UpdateWorkInput) {
  await okamiHttpGateway.put(`/work/update-work/${id}`, data)
}