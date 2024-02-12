import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import { ScrapingReportResponse } from '@/api/fetch-scraping-report'
import { syncWorkChapter } from '@/api/sync-work-chapter'
import { Button } from '@/components/ui/button'

interface ResyncWorkButtonProps {
  workId: string
  currentPage: number
}

export function ResyncWorkButton({
  workId,
  currentPage,
}: ResyncWorkButtonProps) {
  const queryClient = useQueryClient()

  const {
    mutate: syncWork,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ['sync-work', workId],
    mutationFn: syncWorkChapter,
    onError: () => {
      toast.error('Erro ao sincronizar')
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['scrappingReport', currentPage],
        (syncWorkList: ScrapingReportResponse) => {
          const newWorkList = syncWorkList?.data?.map((work) => {
            if (work.id === workId) {
              return {
                ...work,
                refreshStatus: 'Pendente',
              }
            }
            return work
          })

          return {
            ...syncWorkList,
            data: newWorkList,
          }
        },
      )
    },
  })

  return (
    <Button
      data-isError={isError}
      className="data-[isError=true]:text-red-60 data-[isError=true]:border-red-600"
      variant="ghost"
      disabled={isPending}
      aria-label="Desativado temporariamente"
      onClick={() => syncWork({ workId })}
    >
      <RefreshCcw
        data-loading={isPending}
        className="mr-2 size-4 data-[loading=true]:animate-spin"
      />
      {isError ? 'Erro ao sincronizar' : 'Sincronizar'}
    </Button>
  )
}
