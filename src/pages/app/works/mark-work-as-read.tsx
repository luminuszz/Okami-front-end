import { Label } from '@radix-ui/react-dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { filter } from 'lodash'
import { useState } from 'react'
import { toast } from 'sonner'

import { WorkType } from '@/api/fetch-for-works-with-filter'
import { markWorkAsRead } from '@/api/mark-work-as-read'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface MarkChapterReadDialogProps {
  work: {
    id: string
    name: string
    chapter: number
    type: 'ANIME' | 'MANGA'
  }
}

export function MarkWorksAsReadDialog({ work }: MarkChapterReadDialogProps) {
  const [inputValue, setInputValue] = useState(work.chapter?.toString())
  const client = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: markWorkAsRead,
    mutationKey: ['markWorkAsRead', work.id],
    onMutate: () => {
      client.setQueryData<WorkType[]>(['works', 'unread'], (works) =>
        filter(works, (value) => value.id !== work.id),
      )
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['works', 'read'] })
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
