import { okamiHttpGateway } from '@/lib/axios'

export async function sendResetPasswordEmail(email: string) {
  await okamiHttpGateway.post('/auth/password/send-reset-email', {
    email,
  })
}
