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
import { Textarea } from '@/components/ui/textarea'

interface WorkDetailsProps {
  work: {
    name: string
    imageUrl?: string | null
    updatedAt?: string
    category: string
    refreshStatus: string
    url: string
    message: string | null
  }
}

export function WorkDetails({ work }: WorkDetailsProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center">{work.name}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center gap-4">
        <Badge className="ml-1" variant="secondary">
          {work.category}
        </Badge>

        <img
          className="max-h-[500px]"
          src={work.imageUrl ?? ''}
          alt={work.name}
        />

        <span
          data-status={work.refreshStatus}
          className="ml-2 text-slate-500 data-[status=Falhou]:text-red-600 data-[status=Sincronizado]:text-emerald-600"
        >
          {work.refreshStatus}
        </span>

        {work.message && (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-2">
            <Textarea
              className="w-full text-red-500"
              value={work.message}
              readOnly
            />
          </div>
        )}

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
