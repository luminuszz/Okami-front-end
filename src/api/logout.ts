import { okamiHttpGateway } from '@/lib/axios'
import { storageService } from '@/lib/storage'

export async function makeLogout() {
  await okamiHttpGateway.post('auth/logout')

  storageService.delete('okami-refresh-token')
}
