import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'

import { ClipBoardInput } from '@/components/clipboard-input'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'

interface WorkDetailsProps {
  work: {
    name: string
    imageUrl: string
    updatedAt: string
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
        <img className="max-h-[500px]" src={work.imageUrl} alt={work.name} />
        <p>Atualizado: {work.updatedAt}</p>
        <p>Categoria: {work.category}</p>
        <p>Categoria: {work.refreshStatus}</p>
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
