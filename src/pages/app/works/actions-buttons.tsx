import { DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { BookmarkCheck, BookmarkPlus, BookmarkX } from 'lucide-react'

import { getUserTrialQuote } from '@/api/get-user-trial-quote'
import { DeleteWorkDialog } from '@/components/delete-work-dialog'
import { MarkWorksAsFinishedDialog } from '@/components/mark-work-as-finished-dialog'
import { QuoteExceedLimit } from '@/components/quote-execeed-limit-dialog'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

import { CreateWorkFormDialog } from './create-work-form-dialog'

export function ActionsButtons() {
  const { data: userQuote } = useQuery({
    queryKey: ['user-quote'],
    queryFn: getUserTrialQuote,
  })

  const canShowPaymentDialog = userQuote?.remainingQuotas === 0

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        {canShowPaymentDialog ? <QuoteExceedLimit /> : <CreateWorkFormDialog />}

        <DialogTrigger asChild>
          <Button size="sm">
            <BookmarkPlus className="mr-2 size-4" />
            Adicionar obra
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog>
        <MarkWorksAsFinishedDialog />
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            <BookmarkCheck className="mr-2 size-4 text-muted-foreground" />
            Finalizar obra
          </Button>
        </DialogTrigger>
      </Dialog>
      <Dialog>
        <DeleteWorkDialog />
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <BookmarkX className="mr-2 size-4 text-muted-foreground" />
            Excluir obra
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  )
}
