import { okamiHttpGateway } from '@/lib/axios'

export async function uploadAvatarImage(formData: FormData) {
  await okamiHttpGateway.post('/auth/user/avatar/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
