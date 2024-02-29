import { okamiHttpGateway } from '@/lib/axios'

export async function deleteWork(workId: string) {
  await okamiHttpGateway.delete(`/work/${workId}`)
}
