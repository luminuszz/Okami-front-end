import { createContextualCan } from '@casl/react'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

import { checkTelegramIntegration } from '@/api/check-telegram-integration'
import { getUserDetails } from '@/api/get-user-details'
import { getUserTrialQuote } from '@/api/get-user-trial-quote'
import defineAbilityForUser, {
  UserAbilities,
  UserAbilityDetails,
} from '@/lib/casl'

export const AbilityContext = createContext<UserAbilities>({} as UserAbilities)

export const Can = createContextualCan<UserAbilities>(AbilityContext.Consumer)

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
  } satisfies UserAbilityDetails

  const ability = defineAbilityForUser(user)

  return (
    <AbilityContext.Provider value={ability as UserAbilities}>
      {children}
    </AbilityContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(AbilityContext)

  return context
}
