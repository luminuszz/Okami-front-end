import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'
import { Clock } from 'lucide-react'

import { ClipBoardInput } from '@/components/clipboard-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'

interface WorkDetailsProps {
  work: {
    name: string
    imageUrl?: string | null
    updatedAt?: string
    category: string
    refreshStatus: string
    url: string
  }
}

export function WorkDetails({ work }: WorkDetailsProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center">{work.name}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center gap-4">
        <img
          className="max-h-[500px]"
          src={work.imageUrl ?? ''}
          alt={work.name}
        />

        <Badge className="ml-1" variant="secondary">
          {work.category}
        </Badge>

        <span
          data-status={work.refreshStatus}
          className="ml-2 text-slate-500 data-[status=Falhou]:text-red-600 data-[status=Sincronizado]:text-emerald-600"
        >
          {work.refreshStatus}
        </span>

        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-5" />

          <span>{work.updatedAt}</span>
        </p>
        <ClipBoardInput value={work.url} />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Fechar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
