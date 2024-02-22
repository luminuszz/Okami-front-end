import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ScrapingReportResponse } from '@/api/fetch-scraping-report'
import { syncWorkChapter } from '@/api/sync-work-chapter'
import { Button } from '@/components/ui/button'

interface ResyncWorkButtonProps {
  workId: string
}

export function ResyncWorkButton({ workId }: ResyncWorkButtonProps) {
  const queryClient = useQueryClient()

  const [query] = useSearchParams()

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
        ['scrappingReport', query.get('page') ?? 0, query.get('filter')],
        (syncWorkList: ScrapingReportResponse) => {
          const newWorkList = syncWorkList?.data?.map((work) => {
            if (work.id === workId) {
              console.log('work', work)

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
