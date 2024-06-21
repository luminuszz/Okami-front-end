import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { usePermissions } from './permissions-provider'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export function SubscriptionIndicator() {
  const navigate = useNavigate()
  const { isLoadingPermissions, permissions } = usePermissions()

  function handleRedirectToCheckout() {
    navigate('/auth/checkout', { replace: true })
  }

  if (isLoadingPermissions) {
    return <Skeleton className="h-[40px] w-[100px]  rounded-sm" />
  }

  const canShowSubscriberIndicator = permissions.can(
    'show',
    'subscriber-indicator',
  )

  return canShowSubscriberIndicator ? (
    <div className="flex justify-center">
      <Badge variant="outline" className="flex items-center space-x-1 py-1">
        <Crown className="h-5 w-5 text-yellow-400" />
        <span className="text-sm dark:text-gray-100">Premium</span>
      </Badge>
    </div>
  ) : (
    <Button
      variant="secondary"
      onClick={handleRedirectToCheckout}
      className="text-foreground"
    >
      <Crown className="mr-2 size-4 text-muted-foreground" />
      Assine o premium
    </Button>
  )
}
