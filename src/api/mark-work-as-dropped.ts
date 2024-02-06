import { okamiHttpGateway } from '@/lib/axios'

export async function markWorksAsDropped(workId: string) {
  await okamiHttpGateway.patch(`/work/dropped/${workId}`)
}
