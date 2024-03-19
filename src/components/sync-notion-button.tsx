import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { syncWithNotion } from '@/api/sync-with-notion'

import { NotionLogo } from './notion-logo'
import { Button } from './ui/button'

export function SyncNotionButton() {
  const { mutate: startNotionSync, isPending } = useMutation({
    mutationKey: ['sync-notion'],
    mutationFn: syncWithNotion,

    onSuccess() {
      toast.success('Sincronização com Notion iniciada')
    },

    onError() {
      toast.error('Erro ao iniciar a sincronização com Notion')
    },
  })

  return (
    <Button
      variant="outline"
      onClick={() => {
        startNotionSync()
      }}
      disabled={isPending}
    >
      <NotionLogo className="mr-2 size-5" />
      Sincronizar com Notion
    </Button>
  )
}
