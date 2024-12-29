import { okamiHttpGateway } from '@/lib/axios'
import { storageService } from '@/lib/storage'

export interface LogoutInput {
  refreshToken: string | null
}

export async function makeLogout(data: LogoutInput) {
  await okamiHttpGateway.post('auth/logout', {
    refreshToken: data?.refreshToken,
  })

  storageService.delete('okami-refresh-token')
}
