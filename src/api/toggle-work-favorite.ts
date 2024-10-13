import { okamiHttpGateway } from '@/lib/axios.ts'

export async function toggleWorkFavorite(workId: string) {
  await okamiHttpGateway.patch(`/work/${workId}/toggle-favorite`)
}
