import { AbilityBuilder, createMongoAbility } from '@casl/ability'

import {
  permissions,
  UserAbilities,
  UserAbilityDetails,
} from '@/app/permissions'

export default function defineAbilityForUser(user: UserAbilityDetails) {
  const builder = new AbilityBuilder<UserAbilities>(createMongoAbility)

  const hasPermissions = typeof permissions[user.role] === 'function'

  if (!hasPermissions) {
    throw new Error('Invalid role')
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
