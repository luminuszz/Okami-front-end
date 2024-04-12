import { AbilityBuilder } from '@casl/ability'
import { z } from 'zod'

import { AppAbilities } from '@/acl/abilities.ts'
import { UserRoles } from '@/acl/roles.ts'
import { UserSubject } from '@/acl/user-subject.ts'
import { workSchema } from '@/api/fetch-for-works-with-filter.ts'

export const dashboardSubject = z.union([
  z.literal('telegram-button'),
  z.literal('subscriber-indicator'),
  z.literal('work').or(workSchema.extend({ kind: z.literal('work') })),
  z.literal('sync-notion-button'),
  z.literal('all'),
])

export const dashboardActions = z.union([
  z.literal('show'),
  z.literal('use'),
  z.literal('create'),
  z.literal('manage'),
  z.literal('edit'),
  z.literal('delete'),
])

export type PermissionsHandler = (
  user: UserSubject,
  ability: AbilityBuilder<AppAbilities>,
) => void

type PermissionsMap = Record<UserRoles, PermissionsHandler>

export const permissions: PermissionsMap = {
  ADMIN(user, ability) {
    ability.can('manage', 'all')

    if (user.isTelegramSubscriber) {
      ability.cannot('show', 'telegram-button')
    }
  },
  ANONYMOUS_USER() {
    // No permissions
  },
  SUBSCRIBED_USER(user, { can }) {
    can('create', 'work')
    can('show', 'subscriber-indicator')

    if (!user.isTelegramSubscriber) {
      can('show', 'telegram-button')
    }
    if (user?.notionDatabaseId) {
      can('show', 'sync-notion-button')
    }

    can('edit', 'work', { userId: { $eq: user.id } })
    can('delete', 'work', { userId: { $eq: user.id } })
  },

  UNSUBSCRIBED_USER(user, { can }) {
    if (!user.isTelegramSubscriber) {
      can('show', 'telegram-button')
    }
    if (user.trialQuoteLimit > 0) {
      can('create', 'work')
    }

    can('edit', 'work', { userId: { $eq: user.id } })
    can('delete', 'work', { userId: { $eq: user.id } })
  },
}
