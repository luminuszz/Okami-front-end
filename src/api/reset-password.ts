import { okamiHttpGateway } from '@/lib/axios'

export interface ResetPasswordInput {
  newPassword: string
  code: string
}

export async function resetPassword(data: ResetPasswordInput) {
  await okamiHttpGateway.post('/auth/password/reset', data)
}
