import { Label } from '@radix-ui/react-dropdown-menu'
import { filter } from 'lodash'
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { markWorkAsRead } from '@/services/okami-api/okami'
import { Work } from '@/services/okami-api/schemas'

interface MarkChapterReadDialogProps {
  work: {
    id: string
    name: string
    chapter: number
    type: 'ANIME' | 'MANGA'
  }
}

export function MarkChapterReadDialog({ work }: MarkChapterReadDialogProps) {
  const [inputValue, setInputValue] = useState(work.chapter?.toString())
  const client = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: markWorkAsRead,
    mutationKey: markWorkAsRead.name,
    onMutate: () => {
      client.setQueryData<Work[]>(['fetchWorksWithFilter', 'unread'], (works) =>
        filter(works, (value) => value.id !== work.id),
      )
    },
  })

  const message = work.type === 'ANIME' ? 'Episodio' : 'Capitulo'

  async function handleMarkRead() {
    try {
      await mutateAsync({ chapter: parseInt(inputValue), workId: work.id })

      toast.success('Obra atualizada com sucesso')
    } catch (e) {
      toast.error('Erro ao atualizar obra')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{work.name}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label>Marcar como lido</Label>
        <Input
          type="number"
          placeholder={message}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleMarkRead}>Marcar</Button>
        </DialogClose>

        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
