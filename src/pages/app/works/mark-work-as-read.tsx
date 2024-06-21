import { Label } from '@radix-ui/react-dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { filter, find } from 'lodash'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { WorkType } from '@/api/fetch-for-works-with-filter'
import { markNotificationAsRead } from '@/api/mark-notification-as-read.ts'
import { markWorkAsRead } from '@/api/mark-work-as-read'
import { NotificationType } from '@/api/schemas.ts'
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

  const [params] = useSearchParams()

  const { mutateAsync } = useMutation({
    mutationFn: markWorkAsRead,
    mutationKey: ['markWorkAsRead', work.id],
    onMutate: () => {
      client.setQueryData<WorkType[]>(
        ['works', params.get('status')],
        (works) => filter(works, (value) => value.id !== work.id),
      )
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['works', 'read'] })
    },
  })

  const { mutate: markNotificationAsReadCall } = useMutation({
    mutationFn: markNotificationAsRead,
    mutationKey: ['markNotificationWorkAsRead', work.id],
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['recent-notifications'] })
    },
  })

  const message = work.type === 'ANIME' ? 'Episodio' : 'Capitulo'

  async function handleMarkRead() {
    try {
      await mutateAsync({ chapter: parseInt(inputValue), workId: work.id })

      markWorkNotification()

      toast.success('Obra atualizada com sucesso')
    } catch (e) {
      toast.error('Erro ao atualizar obra')
    }
  }

  function markWorkNotification() {
    const currentNotifications = client.getQueryData<NotificationType[]>([
      'recent-notifications',
    ])

    if (currentNotifications?.length) {
      const notification = find(currentNotifications, ({ content, readAt }) => {
        return (
          content.nextChapter >= Number(inputValue) &&
          content.name === work.name &&
          readAt === null
        )
      })

      if (notification) {
        markNotificationAsReadCall(notification.id)
      }
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

      <DialogFooter className="flex-col gap-4 md:flex-row">
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
