/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AbilityBuilder, PureAbility } from "@casl/ability"

export type USER_ROLE = 'ADMIN' | 'USER' | 'SUBSCRIBED_USER'

export interface UserAbilityDetails {
  paymentSubscriptionStatus: 'ACTIVE' | 'INACTIVE'
  trialQuoteLimit: number
  isTelegramSubscriber: boolean
  notionDatabaseId?: string | null
  role: USER_ROLE
}

/* eslint-disable prettier/prettier */
export type Actions = 'show' | 'use' | 'create' | 'manage'

export type Subject =
  | 'telegram-button'
  | 'subscriber-indicator'
  | 'work'
  | 'sync-notion-button'
  | 'rsync-works-button'
  | 'admin-section'
  | 'all'

export type UserAbilities = PureAbility<[Actions, Subject]>

type PermissionsByRole = (
  user: UserAbilityDetails,
  builder: AbilityBuilder<UserAbilities>,
) => void


export const permissions: Record<USER_ROLE, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    if (!user.notionDatabaseId) {
      cannot('show', 'sync-notion-button')
    }
  },
  SUBSCRIBED_USER(user, { can, cannot }) {
    can('show', 'subscriber-indicator')
    can('create', 'work')

    if (!user.isTelegramSubscriber) {
      can('show', 'telegram-button')
    }

    if (!user.notionDatabaseId) {
      cannot('show', 'sync-notion-button')
    }
  },
  USER(user, { can }) {
    if (user.trialQuoteLimit > 0) {
      can('create', 'work')
    }

    if (!user.isTelegramSubscriber) {
      can('show', 'telegram-button')
    }
  },
}
