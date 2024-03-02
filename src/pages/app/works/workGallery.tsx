import { useQuery } from '@tanstack/react-query'
import { compareDesc, parseISO } from 'date-fns'
import { filter } from 'lodash'
import { useSearchParams } from 'react-router-dom'

import {
  fetchWorksWithFilter,
  FilterStatus,
} from '@/api/fetch-for-works-with-filter'
import { Skeleton } from '@/components/ui/skeleton'

import { WorkCard } from './workCard'

export function WorkGallery() {
  const [params] = useSearchParams()

  const status = (params.get('status') as FilterStatus) ?? null
  const search = params.get('name') ?? ''

  const { data: works, isLoading } = useQuery({
    queryFn: () => fetchWorksWithFilter({ status }),
    queryKey: ['works', status].filter(Boolean),
    select: (works) => {
      const filteredWorks = filter(works, (work) =>
        work.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )

      return filteredWorks.sort((a, b) =>
        compareDesc(
          parseISO(a.nextChapterUpdatedAt ?? a.updatedAt ?? a.createdAt),
          parseISO(b.nextChapterUpdatedAt ?? b.updatedAt ?? b.createdAt),
        ),
      )
    },
  })

  const hasWorks = works && works.length > 0

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {Array.from({ length: 50 }).map((_, index) => (
          <Skeleton className="h-[400px] w-[340px] gap-4 rounded" key={index} />
        ))}
      </div>
    )
  }

  if (hasWorks) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      <div className="col-span-full text-center text-muted-foreground">
        Nada por aqui, adicione uma obra para começar
      </div>
    </div>
  )
}
