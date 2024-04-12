import { createContextualCan } from '@casl/react'
import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext } from 'react'

import { AppAbilities, defineAbilityFrom } from '@/acl/abilities.ts'
import { UserRoles } from '@/acl/roles.ts'
import { UserSubject } from '@/acl/user-subject.ts'
import { checkTelegramIntegration } from '@/api/check-telegram-integration'
import { getUserDetails } from '@/api/get-user-details'
import { getUserTrialQuote } from '@/api/get-user-trial-quote'

export const AbilityContext = createContext<AppAbilities>({} as AppAbilities)

export const Can = createContextualCan<AppAbilities>(AbilityContext.Consumer)

interface PermissionsProviderProps {
  children: React.ReactNode
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const userQuery = useQuery({
    queryKey: ['user-details'],
    queryFn: getUserDetails,
  })

  const telegramIntegrationQuery = useQuery({
    queryKey: ['get-telegram-integration'],
    queryFn: checkTelegramIntegration,
  })

  const userQuoteQuery = useQuery({
    queryKey: ['user-quote'],
    queryFn: getUserTrialQuote,
  })

  const user = {
    isTelegramSubscriber: !!telegramIntegrationQuery?.data?.isSubscribed,
    paymentSubscriptionStatus:
      userQuery?.data?.paymentSubscriptionStatus ?? 'INACTIVE',
    trialQuoteLimit: userQuoteQuery?.data?.limit ?? 0,
    notionDatabaseId: userQuery?.data?.notionDatabaseId ?? null,
    kind: 'User',
    id: userQuery?.data?.id ?? '',
  } satisfies UserSubject

  const role: UserRoles = user.paymentSubscriptionStatus
    ? 'SUBSCRIBED_USER'
    : 'UNSUBSCRIBED_USER'

  const ability = defineAbilityFrom(user, role)

  return (
    <AbilityContext.Provider value={ability as AppAbilities}>
      {children}
    </AbilityContext.Provider>
  )
}

export function usePermissions() {
  return useContext(AbilityContext)
}
