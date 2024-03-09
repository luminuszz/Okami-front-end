import { z } from 'zod'

import { okamiHttpGateway } from '@/lib/axios'

import { notificationSchema } from './schemas'

const responseSchema = z.array(notificationSchema)

export async function getRecentNotifications() {
  const response = await okamiHttpGateway.get('notification/recent')

  return responseSchema.parse(response.data)
}
