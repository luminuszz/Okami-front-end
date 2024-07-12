import { okamiHttpGateway } from '@/lib/axios.ts'

interface CreateTagRequest {
  name: string
  color: string
}

export async function createTag(data: CreateTagRequest) {
  await okamiHttpGateway.post('/tags', data)
}
