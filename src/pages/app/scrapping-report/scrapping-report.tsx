import { useQuery } from '@tanstack/react-query'
import { RefreshCcw, Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import {
  fetchScrappingReport,
  ScrapingFilterStatus,
} from '@/api/fetch-scraping-report'
import { Pagination } from '@/components/pagination'
import { Can } from '@/components/permissions-provider'
import { RsyncAllWorksButton } from '@/components/rsync-all-works-button.tsx'
import { SyncNotionButton } from '@/components/sync-notion-button'
import { Badge } from '@/components/ui/badge.tsx'
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
import { parsePageQuery } from '@/utils/helpers.ts'

import { EmptyLoadingTable } from './empty-loading-table'
import { RsyncWorkButton } from './rsync-work-button.tsx'
import { ScrappingFilters } from './scrapping-filter'
import { WorkDetails } from './work-details'

export function ScrappingReport() {
  const [query] = useSearchParams()

  const page = parsePageQuery(query.get('page'))
  const filter = (query.get('filter') as ScrapingFilterStatus) ?? ''
  const search = query.get('search') ?? ''

  const {
    data: works,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['scrappingReport', page, filter, search],
    queryFn: () => fetchScrappingReport({ page, filter, search }),
  })

  const totalOfWorks = works?.totalOfPages ? works.totalOfPages * 10 : 0

  return (
    <>
      <Helmet title="Sincronizações" />

      <div className="flex  flex-col gap-4">
        <div className="flex justify-center md:justify-start">
          <h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
            Sincronizações
          </h1>
        </div>

        <header className="flex  flex-col-reverse justify-center  md:flex-row md:justify-between">
          <ScrappingFilters />

          <div className="flex flex-col items-center  justify-center gap-2 md:flex-row">
            <Can I="show" a="sync-notion-button">
              <SyncNotionButton />
            </Can>

            <Can I="show" a="rsync-works-button">
              <RsyncAllWorksButton />
            </Can>
          </div>
        </header>

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
                <TableHead>Titulo da obra</TableHead>
                <TableHead className="w-[180px]">Sincronizado há </TableHead>
                <TableHead className="w-[140px]">Ultimo Cap/Ep</TableHead>
                <TableHead className="w-[160px]">Tipo de Obra</TableHead>
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
                      <WorkDetails
                        work={{
                          category: work.category,
                          name: work.name,
                          refreshStatus: work.refreshStatus,
                          url: work.url,
                          imageUrl: work.imageUrl,
                          updatedAt: work.updatedAt,
                          message: work.message,
                        }}
                      />
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Search className="size-3" />
                          <span className="sr-only">Detalhes da obra</span>
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </TableCell>

                  <TableCell className="font-medium">{work.name}</TableCell>
                  <TableCell className="text-muted-foreground ">
                    {work.updatedAt}
                  </TableCell>
                  <TableCell>{`${work.category === 'ANIME' ? 'Episódio' : 'Capítulo'} ${work.nextChapter ?? work.chapter}`}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{work.category}</Badge>
                  </TableCell>
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
                    {['Falhou'].includes(work.refreshStatus) && (
                      <RsyncWorkButton
                        workId={work.id}
                        isPending={work.refreshStatus === 'Pendente'}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex text-sm font-medium">
            Total de {totalOfWorks} sincronizações
          </div>

          <div className="flex">
            <Pagination
              totalOfPages={works?.totalOfPages ?? 0}
              currentPage={page}
            />
          </div>
        </div>
      </div>
    </>
  )
}
