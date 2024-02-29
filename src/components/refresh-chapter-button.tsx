import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, RefreshCcwDot } from 'lucide-react'
import { toast } from 'sonner'

import { refreshChapterStatus } from '@/api/refresh-chapters-status'

import { Button } from './ui/button'

export function RefreshChapterButton() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['refresh-chapter-status'],
    mutationFn: refreshChapterStatus,
    onSuccess: () => {
      toast.success('Sincronização iniciada com sucesso!')

      queryClient.invalidateQueries({
        queryKey: ['scrappingReport'],
      })
    },
    onError: () => {
      toast.error('Erro ao sincronizar os capítulos')
    },
  })

  return (
    <Button
      size="sm"
      // disabled={isPending}
      aria-label="Sincronizar todas as obras"
      disabled={true}
      variant="secondary"
      onClick={() => mutate()}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <RefreshCcwDot className="mr-2 size-4 text-muted-foreground" />
      )}
      Sincronizar todas as obras
    </Button>
  )
}
