import { okamiHttpGateway } from '@/lib/axios.ts'

export async function deleteSearchToken(id: string) {
  await okamiHttpGateway.delete(`/search-token/${id}`)
}
