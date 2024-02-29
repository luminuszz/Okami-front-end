import { DialogClose } from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'

import { Button } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export function QuoteExceedLimit() {
  const navigate = useNavigate()

  function handleUpgrade() {
    navigate('/auth/checkout')
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Limites de obras excedido</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Você ultrapassou o limite da sua conta gratuita. Faça um upgrade para
        ter obras ilimitadas !
      </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button onClick={handleUpgrade}>Upgrade para o Premium</Button>
      </DialogFooter>
    </DialogContent>
  )
}
