import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability'

export interface UserAbilityDetails {
  paymentSubscriptionStatus: 'ACTIVE' | 'INACTIVE'
  trialQuoteLimit: number
  isTelegramSubscriber: boolean
}

type Actions = 'show' | 'use' | 'create'

type Subject = 'telegram-button' | 'subscriber-indicator' | 'work'

export type UserAbilities = PureAbility<[Actions, Subject]>

export default function defineAbilityForUser(user: UserAbilityDetails) {
  const ability = new AbilityBuilder<UserAbilities>(createMongoAbility)

  if (user.paymentSubscriptionStatus === 'ACTIVE') {
    ability.can('show', 'subscriber-indicator')
  } else {
    ability.cannot('show', 'subscriber-indicator')
  }

  if (user.trialQuoteLimit > 0) {
    ability.can('create', 'work')
  } else {
    ability.cannot('create', 'work')
  }

  if (!user.isTelegramSubscriber) {
    ability.can('show', 'telegram-button')
  } else {
    ability.cannot('show', 'telegram-button')
  }

  return ability.build()
}