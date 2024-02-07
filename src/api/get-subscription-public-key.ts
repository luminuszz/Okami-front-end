import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

const getSubscriptionPublicKeySchema = z.object({
  publicKey: z.string(),
})

type GetSubscriptionPublicKeyOutput = z.infer<
  typeof getSubscriptionPublicKeySchema
>

export async function getSubscriptionPublicKey() {
  const { data } = await okamiHttpGateway.get<GetSubscriptionPublicKeyOutput>(
    'notification/push/browser/public-key',
  )

  return getSubscriptionPublicKeySchema.parse(data)
}
