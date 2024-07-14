import { okamiHttpGateway } from '@/lib/axios.ts'

export async function deleteTag(tagId: string) {
  await okamiHttpGateway.delete(`/tags/${tagId}`)
}
