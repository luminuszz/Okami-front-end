import { useQuery } from '@tanstack/react-query'
import { compareDesc } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { Skeleton } from '@/components/ui/skeleton'

import { WorkCard } from './workCard'

export function WorkGallery() {
  const [filter] = useSearchParams()

  const filterName = filter.get('name')

  const status = filter.get('status') || 'unread'

  const { data: works, isLoading } = useQuery({
    queryFn: () => fetchWorksWithFilter(status),
    queryKey: ['works', status],
    select: (works) =>
      works
        .filter((work) =>
          work.name.toLowerCase().includes(filterName?.toLowerCase() ?? ''),
        )
        .sort((a, b) => compareDesc(a.updatedAt, b.updatedAt)),
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {Array.from({ length: 50 }).map((_, index) => (
          <Skeleton className="h-[400px] w-[340px] gap-4 rounded" key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {works?.map((work) => <WorkCard key={work.id} work={work} />)}
    </div>
  )
}
