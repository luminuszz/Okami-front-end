import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, BookHeart } from 'lucide-react'

import { fetchFavoritesWorks } from '@/api/fetch-favorites-works.ts'
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
    chapter: number
    createdAt: string
  }
}

const SyncItemList = ({ work }: SyncItemProps) => {
  const formattedUpdateAt = formatDistance(
    parseISO(work.nextChapterUpdatedAt || work.createdAt),
    new Date(),
    {
      addSuffix: true,
      includeSeconds: true,
      locale: ptBR,
    },
  )

  const label = work.type === 'ANIME' ? `Episodio:` : `Capitulo:`

  const message = work.nextChapter
    ? `Novo ${label} ${work.nextChapter}`
    : `Ultimo ${label} ${work.chapter}`

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
          <span className="max-w-xs break-words text-base  font-normal text-foreground md:max-w-sm md:text-clip">
            {work.title}
          </span>

          <p
            className={clsx('text-sm font-medium text-muted-foreground', {
              'text-emerald-700': !!work.nextChapter,
              'text-muted-foreground': !work.nextChapter,
            })}
          >
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

export function FavoriteSyncList() {
  const filter = 'unread'

  const { data: works, isLoading } = useQuery({
    queryKey: ['works', filter],
    queryFn: fetchFavoritesWorks,
    select: (data) =>
      data
        .sort((a, b) => {
          return (b.hasNewChapter ? 1 : 0) - (a.hasNewChapter ? 1 : 0)
        })
        .slice(0, 7),
  })

  const hasNoWorks = works?.length === 0

  return (
    <Card>
      <CardHeader className="flex  flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="font-medium text-foreground">
            Favoritos
          </CardTitle>
          <CardDescription>
            Sincronização de suas obras favoritas
          </CardDescription>
        </div>

        <BookHeart className="size-5 text-muted-foreground" />
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
                chapter: item.chapter,
                createdAt: item.createdAt,
              }}
            />
          ))
        )}

        {hasNoWorks && (
          <div className="h-[400px]">
            <p className="text-center text-muted-foreground">
              Você não tem nenhuma obra favorita
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
