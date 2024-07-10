import { okamiHttpGateway } from '@/lib/axios'

export interface CreateSearchToken {
  token: string
  type: string
}

export async function createSearchToken(data: CreateSearchToken) {
  await okamiHttpGateway.post('/search-token', data)
}
