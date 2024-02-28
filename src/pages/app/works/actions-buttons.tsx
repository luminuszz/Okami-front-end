import { DialogTrigger } from '@radix-ui/react-dialog'
import { BookmarkCheck, BookmarkX } from 'lucide-react'

import { DeleteWorkDialog } from '@/components/delete-work-dialog'
import { MarkWorksAsFinishedDialog } from '@/components/mark-work-as-finished-dialog'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

export function ActionsButtons() {
  return (
    <div className="flex items-center gap-2">
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
