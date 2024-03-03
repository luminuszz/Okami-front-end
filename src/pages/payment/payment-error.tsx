import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function PaymentError() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-4 md:mt-0 ">
      <h2 className="text-center text-2xl text-muted-foreground">
        Houve um erro ao processar o pagamento
      </h2>
      <Button variant="outline">
        <Link to="/auth/checkout">Tentar novamente</Link>
      </Button>

      <Button variant="link">
        <Link to="/">Voltar o dashboard</Link>
      </Button>
    </div>
  )
}
