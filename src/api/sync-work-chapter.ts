import { okamiHttpGateway } from '@/lib/axios'

interface SyncWorkParams {
  workId: string
}

export async function syncWorkChapter({ workId }: SyncWorkParams) {
  await okamiHttpGateway.post('/work/sync-work', {
    workId,
  })
}
