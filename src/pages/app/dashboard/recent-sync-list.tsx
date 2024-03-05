import {} from '@radix-ui/react-avatar'
import { useQuery } from '@tanstack/react-query'
import { compareDesc, formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, FolderSync } from 'lucide-react'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { SkeletonRecentSyncList } from './skeleton-recent-sync-list'

interface SyncItemProps {
  work: {
    title: string
    type: string
    imageUrl: string
    nextChapterUpdatedAt: string
    nextChapter: number
    url: string
  }
}

const SyncItemList = ({ work }: SyncItemProps) => {
  const formattedUpdateAt = formatDistance(
    parseISO(work.nextChapterUpdatedAt),
    new Date(),
    {
      addSuffix: true,
      includeSeconds: true,
      locale: ptBR,
    },
  )

  const message =
    work.type === 'ANIME'
      ? `Novo Episodio: ${work.nextChapter} `
      : `Novo Capitulo:  ${work.nextChapter}`

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-2">
        <header className="flex items-center justify-center">
          <Avatar>
            <AvatarImage src={work.imageUrl} />
          </Avatar>
        </header>

        <div
          className="flex cursor-pointer flex-col"
          onClick={() => window.open(work.url)}
        >
          <span className="break-words text-base font-normal  text-foreground md:max-w-xs">
            {work.title}
          </span>

          <p className="text-sm font-medium text-muted-foreground">
            {`${message} - ${formattedUpdateAt}`}
          </p>
        </div>
      </div>

      <Button
        className="hidden md:flex"
        variant="ghost"
        onClick={() => window.open(work.url)}
      >
        <ArrowRight className="mr-2 size-4" />
        Ir para o site
      </Button>
    </div>
  )
}

export function RecentSyncList() {
  const filter = 'unread'

  const { data: works, isLoading } = useQuery({
    queryKey: ['works', filter],
    queryFn: () => fetchWorksWithFilter({ status: filter }),
    select: (data) =>
      data
        .sort((a, b) =>
          compareDesc(
            new Date(a.nextChapterUpdatedAt || ''),
            new Date(b.nextChapterUpdatedAt || ''),
          ),
        )
        .slice(0, 7),
  })

  const hasNoWorks = works?.length === 0

  return (
    <Card>
      <CardHeader className="flex  flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="font-medium text-foreground">
            Sincronizações
          </CardTitle>
          <CardDescription>Sincronização de obras recentes</CardDescription>
        </div>

        <FolderSync className="size-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="flex flex-col gap-5 ">
        {isLoading ? (
          <SkeletonRecentSyncList />
        ) : (
          works?.map((item) => (
            <SyncItemList
              key={item.id}
              work={{
                imageUrl: item.imageUrl ?? '',
                nextChapter: item.nextChapter || 0,
                nextChapterUpdatedAt: item.nextChapterUpdatedAt || '',
                title: item.name,
                type: item.category,
                url: item.url,
              }}
            />
          ))
        )}

        {hasNoWorks && (
          <div className="h-[400px]">
            <p className="text-center text-muted-foreground">
              Você não tem nenhuma obra recente
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
