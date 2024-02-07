import { useMutation } from '@tanstack/react-query'
import { Loader2, RefreshCcwDot } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { refreshChapterStatus } from '@/api/refresh-chapters-status'

import { Button } from './ui/button'

export function RefreshChapterButton() {
  const { mutate, isPending, status } = useMutation({
    mutationKey: ['refresh-chapter-status'],
    mutationFn: refreshChapterStatus,
  })

  useEffect(() => {
    if (status === 'success') {
      toast.success('Sincronização iniciada com sucesso!')
    }

    if (status === 'error') {
      toast.error('Erro ao sincronizar os capítulos')
    }
  }, [status])

  return (
    <Button
      size="sm"
      disabled={isPending}
      variant="secondary"
      onClick={() => mutate()}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <RefreshCcwDot className="mr-2 size-4 text-muted-foreground" />
      )}
      Buscar novas atualizações
    </Button>
  )
}
