import { okamiHttpGateway } from '@/lib/axios.ts'

interface UpdateTagRequest {
  id: string
  name?: string
  color?: string
}

export async function updateTag(data: UpdateTagRequest) {
  await okamiHttpGateway.put(`/tags/${data.id}`, {
    name: data.name,
    color: data.color,
  })
}
