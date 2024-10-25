import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import {
  fetchWorksWithFilter,
  FilterStatus,
  WorkType,
} from '@/api/fetch-for-works-with-filter'
import { Skeleton } from '@/components/ui/skeleton'
import { convertAndCompareDescendingDates } from '@/utils/helpers'

import { WorkCard } from './workCard'

export const worksGalleryQueryKey = 'works-gallery'

export function WorkGallery() {
  const [params] = useSearchParams()

  const status = params.get('status') as FilterStatus

  const search = params.get('name')

  const { data: works, isLoading } = useQuery({
    queryFn: () => fetchWorksWithFilter({ status, search }),
    queryKey: [worksGalleryQueryKey, { status, search }],
    select: filterAndSortWorks,
  })

  function filterAndSortWorks(works: WorkType[]) {
    const sortedWorks = works.sort((a, b) => {
      const aDate = a.updatedAt ?? a.createdAt
      const bDate = b.updatedAt ?? b.createdAt

      return convertAndCompareDescendingDates(aDate, bDate)
    })

    return sortedWorks
  }

  const hasWorks = works && works.length > 0

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 50 }).map((_, index) => (
          <Skeleton className="h-[600px] max-w-xl gap-4 rounded" key={index} />
        ))}
      </div>
    )
  }

  if (!hasWorks) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <div className="text-muted`-foreground col-span-full text-center">
          Nada por aqui, adicione uma obra para começar
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  )
}
