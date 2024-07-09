import { okamiHttpGateway } from '@/lib/axios'

export interface CreateSearchToken {
  token: string
  type: string
}

export async function createSearchToken(data: CreateSearchToken) {
  await okamiHttpGateway.post('/work/search-token', data)
}
