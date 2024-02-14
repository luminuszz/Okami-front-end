import { okamiHttpGateway } from '@/lib/axios'

export async function makeLogout() {
  await okamiHttpGateway.post('auth/logout')
}
