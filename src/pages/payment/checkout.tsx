import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { createPaymentCheckout } from '@/api/create-payment-checkout'
import { getUserDetails } from '@/api/get-user-details'

export function Checkout() {
  const navigate = useNavigate()

  const { mutateAsync: createCheckout, isPending: isCreatingCheckout } =
    useMutation({
      mutationFn: createPaymentCheckout,
      mutationKey: ['createPaymentCheckout'],
    })

  const { refetch: getCurrentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userDetails'],
    queryFn: getUserDetails,
    enabled: false,
  })

  const showLoading = isLoadingUser || isCreatingCheckout

  const createPaymentCheckoutHandler = useCallback(async () => {
    try {
      const { data: user } = await getCurrentUser({ throwOnError: true })

      const userHasActiveSubscription =
        user?.paymentSubscriptionStatus === 'ACTIVE'

      if (userHasActiveSubscription) {
        toast.warning('Você já possui uma assinatura ativa')

        navigate('/', { replace: true })

        return
      }

      const { paymentSessionId } = await createCheckout()

      window.location.replace(paymentSessionId)
    } catch (error) {
      toast.error('Erro ao verificar assinatura ativa')
    }
  }, [createCheckout, getCurrentUser, navigate])

  useEffect(() => {
    createPaymentCheckoutHandler()
  }, [createPaymentCheckoutHandler])

  return (
    <div className="flex items-center justify-center">
      {showLoading ? (
        <Loader2 className="size-32 animate-spin" />
      ) : (
        <p>Redirecionando...</p>
      )}
    </div>
  )
}
