import { useQuery } from '@tanstack/react-query'
import { compareDesc, formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const filter = 'unread'

export function WorksUpdated() {
  const { data: works } = useQuery({
    queryKey: ['works', filter],
    queryFn: () => fetchWorksWithFilter(filter),
    select: (data) =>
      data
        .sort((a, b) =>
          compareDesc(new Date(a.updatedAt), new Date(b.updatedAt)),
        )
        .slice(0, 5)
        .map((work) => ({
          ...work,
          formattedUpdatedAt: formatDistance(
            parseISO(work.nextChapterUpdatedAt ?? work.updatedAt),
            new Date(),
            {
              addSuffix: true,
              includeSeconds: true,
              locale: ptBR,
            },
          ),
          formattedNewChapterMessage:
            work.category === 'ANIME'
              ? `Novo Episodio: ${work.nextChapter} `
              : `Novo Capitulo:  ${work.nextChapter}`,
        })),
  })

  return (
    <Carousel
      className=" col-span-4 ml-10 w-full max-w-lg"
      opts={{ align: 'center', loop: true, direction: 'ltr' }}
    >
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Obras atualizadas
          </CardTitle>
        </CardHeader>

        <CarouselContent className="flex items-center justify-center">
          {works?.map((work) => (
            <CarouselItem key={work.id}>
              <div className="p-15 flex flex-1 flex-col items-center justify-center gap-4 p-4">
                <div className="w-[300px] text-center">
                  <p className="truncate  font-bold leading-none text-muted-foreground">
                    {work.name}
                  </p>
                </div>
                <span className="text-emerald-500">
                  {work.formattedNewChapterMessage}
                </span>

                <div className="h-[400px] w-full">
                  <img
                    className="size-full rounded-lg bg-cover"
                    src={work.imageUrl}
                    alt={work.name}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Card>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
