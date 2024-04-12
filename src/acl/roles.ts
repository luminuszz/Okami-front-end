import { z } from 'zod'

export const userRoles = z.union([
  z.literal('SUBSCRIBED_USER'),
  z.literal('UNSUBSCRIBED_USER'),
  z.literal('ADMIN'),
  z.literal('ANONYMOUS_USER'),
])

export type UserRoles = z.infer<typeof userRoles>
