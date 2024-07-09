import { createContextualCan } from '@casl/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { checkTelegramIntegration } from '@/api/check-telegram-integration'
import { getUserDetails } from '@/api/get-user-details'
import { getUserTrialQuote } from '@/api/get-user-trial-quote'
import { UserAbilities, UserAbilityDetails } from '@/app/permissions'
import defineAbilityForUser from '@/lib/casl'

export const AbilityContext = createContext<UserAbilities>({} as UserAbilities)

export const Can = createContextualCan<UserAbilities>(AbilityContext.Consumer)

interface PermissionsProviderProps {
  children: ReactNode
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
    notionDatabaseId: userQuery?.data?.notionDatabaseId,
    role: userQuery?.data?.role || 'USER',
  } satisfies UserAbilityDetails

  const ability = defineAbilityForUser(user)

  return (
    <AbilityContext.Provider value={ability as UserAbilities}>
      {children}
    </AbilityContext.Provider>
  )
}

export function usePermissions() {
  const queryClient = useQueryClient()

  const isLoadingPermissions = [
    queryClient.getQueryState(['user-details'])?.status === 'pending',
    queryClient.getQueryState(['get-telegram-integration'])?.status ===
      'pending',
    queryClient.getQueryState(['user-quote'])?.status === 'pending',
  ].some(Boolean)

  const context = useContext(AbilityContext)

  return { permissions: context, isLoadingPermissions }
}
