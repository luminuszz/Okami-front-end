import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability'

export interface UserAbilityDetails {
  paymentSubscriptionStatus: 'ACTIVE' | 'INACTIVE'
  trialQuoteLimit: number
  isTelegramSubscriber: boolean
  notionDatabaseId?: string
}

type Actions = 'show' | 'use' | 'create'

type Subject =
  | 'telegram-button'
  | 'subscriber-indicator'
  | 'work'
  | 'sync-notion-button'

export type UserAbilities = PureAbility<[Actions, Subject]>

export default function defineAbilityForUser(user: UserAbilityDetails) {
  const ability = new AbilityBuilder<UserAbilities>(createMongoAbility)

  if (user.paymentSubscriptionStatus === 'ACTIVE') {
    ability.can('show', 'subscriber-indicator')
  }

  if (user.paymentSubscriptionStatus === 'ACTIVE' && user.notionDatabaseId) {
    ability.can('show', 'sync-notion-button')
  }

  if (user.trialQuoteLimit > 0) {
    ability.can('create', 'work')
  }

  if (!user.isTelegramSubscriber) {
    ability.can('show', 'telegram-button')
  }

  if (user?.notionDatabaseId) {
    ability.can('show', 'sync-notion-button')
  }

  return ability.build()
}
