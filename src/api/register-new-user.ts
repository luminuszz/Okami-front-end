import { okamiHttpGateway } from '@/lib/axios'

interface RegisterNewUserInput {
  email: string
  password: string
  name: string
}

export async function registerNewUser({
  email,
  name,
  password,
}: RegisterNewUserInput) {
  await okamiHttpGateway.post('/auth/register', {
    email,
    name,
    password,
  })
}
