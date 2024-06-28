import { useMutation } from '@tanstack/react-query'
import { Loader2, RefreshCcwDot } from 'lucide-react'
import { toast } from 'sonner'

import { refreshChapterStatus } from '@/api/refresh-chapters-status'

import { Button } from './ui/button'

export function RsyncAllWorksButton() {
  const { mutate, isPending } = useMutation({
    mutationKey: ['refresh-chapter-status'],
    mutationFn: refreshChapterStatus,
    onSuccess: () => {
      toast.success('Sincronização iniciada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao sincronizar os capítulos')
    },
  })

  return (
    <Button
      className="h-[40px]"
      size="sm"
      disabled={isPending}
      aria-label="Sincronizar todas as obras"
      variant="outline"
      onClick={() => mutate()}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-5 animate-spin" />
      ) : (
        <RefreshCcwDot className="mr-2 size-5 text-muted-foreground" />
      )}
      Sincronizar todas as obras
    </Button>
  )
}
