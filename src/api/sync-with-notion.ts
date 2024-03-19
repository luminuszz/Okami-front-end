import { okamiHttpGateway } from '@/lib/axios'

export async function syncWithNotion() {
  await okamiHttpGateway.post('/work/sync-to-notion')
}
