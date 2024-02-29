import { useQuery } from '@tanstack/react-query'
import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getUserDetails } from '@/api/get-user-details'

import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function SubscriptionIndicator() {
  const navigate = useNavigate()

  const { data: user } = useQuery({
    queryKey: ['user-details'],
    queryFn: getUserDetails,
  })

  function handleRedirectToCheckout() {
    console.log('Redirecting to checkout')
    navigate('/auth/checkout', { replace: true })
  }

  if (user?.paymentSubscriptionStatus === 'ACTIVE') {
    return (
      <Badge variant="outline" className="flex items-center space-x-1 py-1">
        <Crown className="h-5 w-5 text-yellow-400" />
        <span className="text-sm text-white">Premium</span>
      </Badge>
    )
  }

  return (
    <Button variant="secondary" onClick={handleRedirectToCheckout}>
      <Crown className="mr-2 size-4 text-muted-foreground" />
      Assine o premium
    </Button>
  )
}
