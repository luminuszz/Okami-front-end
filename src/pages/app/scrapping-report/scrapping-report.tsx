import { useQuery } from '@tanstack/react-query'
import { RefreshCcw, Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchScrappingReport } from '@/api/fetch-scraping-report'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { EmptyLoadingTable } from './empty-loading-table'
import { ResyncWorkButton } from './re-sync-work-buttont'
import { WorkDetails } from './work-details'

export function ScrappingReport() {
  const [query] = useSearchParams()

  const page = z.coerce
    .number()
    .transform((value) => value - 1)
    .parse(query.get('page') ?? '1')

  const {
    data: works,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['scrappingReport', page],
    queryFn: () => fetchScrappingReport({ page }),
    refetchIntervalInBackground: false,
  })

  const totalOfWorks = (works?.totalOfPages ?? 10) * 10

  return (
    <>
      <Helmet title="Sincronizações" />

      <div className="flex  flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tighter">Sincronizações</h1>

        <div className="rounded-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">
                  {isFetching && (
                    <RefreshCcw className="animate-spin text-muted-foreground" />
                  )}
                </TableHead>
                <TableHead className="w-[140px] ">Identificador</TableHead>
                <TableHead className="w-[180px]">Sincronizado há </TableHead>
                <TableHead>Titulo da obra</TableHead>
                <TableHead className="w-[140px]">Ultimo Cap/Ep</TableHead>
                <TableHead className="w-[160px]">Categoria</TableHead>
                <TableHead className="w-[140px]">Status da Obra</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && <EmptyLoadingTable />}

              {works?.data?.map((work) => (
                <TableRow key={work.id}>
                  <TableCell>
                    <Dialog>
                      <WorkDetails work={work} />
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Search className="size-3" />
                          <span className="sr-only">Detalhes da obra</span>
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium">
                    {work.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground ">
                    {work.updatedAt}
                  </TableCell>
                  <TableCell className="font-medium">{work.name}</TableCell>
                  <TableCell>{`${work.category === 'ANIME' ? 'Episódio' : 'Capítulo'} ${work.chapter}`}</TableCell>
                  <TableCell>{work.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        data-status={work.refreshStatus}
                        className="data-status mr-2 size-2 rounded-full data-[status=Falhou]:bg-red-500 data-[status=Pendente]:bg-slate-400 data-[status=Sincronizado]:bg-emerald-500"
                      ></span>
                      <span className="font-medium text-muted-foreground">
                        {work.refreshStatus}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <ResyncWorkButton currentPage={page} workId={work.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="px- flex items-center justify-between">
          <div className="flex text-sm font-medium">
            Total de {totalOfWorks} sincronizações
          </div>

          <div className="flex">
            <Pagination totalOfPages={works?.totalOfPages || 0} />
          </div>
        </div>
      </div>
    </>
  )
}
