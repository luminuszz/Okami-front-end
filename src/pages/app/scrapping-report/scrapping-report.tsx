import { useQuery } from '@tanstack/react-query'
import { RefreshCcw, Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchScrappingReport } from '@/api/fetch-scraping-report'
import { Pagination } from '@/components/pagination'
import { RefreshChapterButton } from '@/components/refresh-chapter-button'
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
import { ScrappingFilters } from './scrapping-filter'
import { WorkDetails } from './work-details'

export function ScrappingReport() {
  const [query] = useSearchParams()

  const page = z.coerce
    .number()
    .transform((value) => value - 1)
    .parse(query.get('page') ?? '1')

  const filter =
    (query.get('filter') as 'PENDING' | 'SUCCESS' | 'FAILED') ?? 'SUCCESS'

  const {
    data: works,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['scrappingReport', page, filter],
    queryFn: () => fetchScrappingReport({ page, filter }),
    refetchOnWindowFocus: true,
  })

  const totalOfWorks = (works?.totalOfPages ?? 10) * 10

  return (
    <>
      <Helmet title="Sincronizações" />

      <div className="flex  flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tighter">
            Sincronizações
          </h1>
          <RefreshChapterButton />
        </div>

        <ScrappingFilters />

        <div className="rounded-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    <RefreshCcw
                      data-IsFetching={isFetching}
                      className="text-muted-foreground data-[isFetching=true]:animate-spin"
                    />
                  </Button>
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
                  <TableCell>{`${work.category === 'ANIME' ? 'Episódio' : 'Capítulo'} ${work.nextChapter ?? work.chapter}`}</TableCell>
                  <TableCell>{work.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="relative flex size-2">
                        <span
                          data-status={work.refreshStatus}
                          className="absolute inline-flex h-full w-full rounded-full  bg-slate-400 opacity-75 data-[status=Pendente]:animate-ping data-[status=Falhou]:bg-red-400 data-[status=Pendente]:bg-yellow-400 data-[status=Sincronizado]:bg-emerald-500"
                        ></span>
                        <span
                          data-status={work.refreshStatus}
                          className="relative inline-flex size-2 rounded-full bg-slate-500 data-[status=Falhou]:bg-red-500 data-[status=Pendente]:bg-yellow-500 data-[status=Sincronizado]:bg-emerald-500"
                        ></span>
                      </span>

                      <span className="ml-3 font-medium text-muted-foreground">
                        {work.refreshStatus}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <ResyncWorkButton workId={work.id} />
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
            <Pagination
              totalOfPages={works?.totalOfPages || 0}
              currentPage={page}
            />
          </div>
        </div>
      </div>
    </>
  )
}
