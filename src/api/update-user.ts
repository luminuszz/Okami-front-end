import { okamiHttpGateway } from '@/lib/axios'

type UpdateUserCallInput = Partial<{
  email: string
  name: string
}>

export async function updateUserCall(data: UpdateUserCallInput) {
  await okamiHttpGateway.put('/auth/user', data)
}
