import { DialogTrigger } from '@radix-ui/react-dialog'
import { BookmarkCheck, BookmarkPlus } from 'lucide-react'

import { MarkWorksAsFinishedDialog } from '@/components/mark-work-as-finished-dialog'
import { usePermissions } from '@/components/permissions-provider'
import { QuoteExceedLimit } from '@/components/quote-execeed-limit-dialog'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

import { CreateWorkFormDialog } from './create-work-form-dialog'

export function ActionsButtons() {
  const permissions = usePermissions()

  const canShowPaymentDialog = permissions.cannot('create', 'work')

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
    </div>
  )
}
