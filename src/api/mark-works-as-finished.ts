import { okamiHttpGateway } from '@/lib/axios'

export async function markWorksAsFinished(workId: string) {
  await okamiHttpGateway.patch(`/work/mark-finished/${workId}`)
}
