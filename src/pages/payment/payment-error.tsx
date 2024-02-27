import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function PaymentError() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl text-muted-foreground">
        Houve um erro ao processar o pagamento
      </h2>
      <Button variant="link">
        <Link to="/auth/checkout">Tentar novamente</Link>
      </Button>
    </div>
  )
}
