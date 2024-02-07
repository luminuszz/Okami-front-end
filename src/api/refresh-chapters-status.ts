import { okamiHttpGateway } from '@/lib/axios'

export async function refreshChapterStatus() {
  await okamiHttpGateway.get('/work/refresh-chapters')
}
