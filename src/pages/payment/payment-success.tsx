import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function PaymentSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const ref = setTimeout(() => {
      navigate('/', { replace: true })
    }, 3000)

    return () => {
      clearTimeout(ref)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl text-emerald-500">Pagamento aprovado !</h2>
      <p className="text-xl text-muted-foreground">
        Você será redirecionado ao Dashboard
      </p>
    </div>
  )
}
