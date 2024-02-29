import { okamiHttpGateway } from '@/lib/axios'

export async function createWork(data: FormData) {
  await okamiHttpGateway.post('/work', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
