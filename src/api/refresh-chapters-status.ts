import { okamiHttpGateway } from '@/lib/axios'

export async function refreshChapterStatus() {
  await okamiHttpGateway.post('/work/refresh-chapters')
}
