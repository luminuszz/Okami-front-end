import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { createPaymentCheckout } from '@/api/create-payment-checkout'

export function Checkout() {
  const { mutateAsync } = useMutation({
    mutationFn: createPaymentCheckout,
    mutationKey: ['createPaymentCheckout'],
  })

  useEffect(() => {
    mutateAsync()
      .then(({ paymentSessionId }) => {
        window.location.href = paymentSessionId
      })
      .catch((error) => {
        console.error(error)

        toast.error('Não foi possível criar a sessão de pagamento')
      })
  }, [mutateAsync])

  return (
    <div className="flex items-center justify-center">
      <Loader2 className="size-56 animate-spin text-muted-foreground " />
    </div>
  )
}
