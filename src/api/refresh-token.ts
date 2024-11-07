import { okamiHttpGateway } from '@/lib/axios'

export async function refreshTokenCall(refreshToken: string) {
  await okamiHttpGateway.post('/auth/v2/refresh-token', {
    refreshToken,
  })
}
