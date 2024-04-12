import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import {
  dashboardActions,
  dashboardSubject,
  permissions,
} from '@/acl/permissions.ts'
import { UserRoles } from '@/acl/roles.ts'
import { UserSubject } from '@/acl/user-subject.ts'

type Actions = z.infer<typeof dashboardActions>
type Subjects = z.infer<typeof dashboardSubject>

export type AppAbilities = MongoAbility<[Actions, Subjects]>

export const createAppAbility =
  createMongoAbility as CreateAbility<AppAbilities>

export function defineAbilityFrom(user: UserSubject, role: UserRoles) {
  const abilityBuilder = new AbilityBuilder(createAppAbility)

  const permissionHandler = permissions[role]

  permissionHandler(user, abilityBuilder)

  return abilityBuilder.build({
    detectSubjectType(subject) {
      return subject.kind
    },
  })
}
