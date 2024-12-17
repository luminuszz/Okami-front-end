import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSearchParams } from 'react-router-dom'

import { FilterStatus } from '@/api/fetch-for-works-with-filter'
import { fetchForWorksWithPageFilterPaged } from '@/api/fetch-for-works-with-filter-paged'
import { Skeleton } from '@/components/ui/skeleton'

import { WorkCard } from './workCard'

export const worksGalleryQueryKey = 'works-gallery'

export function WorkGallery() {
  const { ref: finalDivInScrollRef, inView: inScrollFinal } = useInView()

  const [params] = useSearchParams()

  const status = (params.get('status') as FilterStatus) || null
  const search = params.get('name')

  const {
    data: works,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [worksGalleryQueryKey, { status, search }],
    queryFn: ({ pageParam }) =>
      fetchForWorksWithPageFilterPaged({
        limit: 30,
        page: pageParam,
        status,
        search,
      }),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: (cursor) => cursor?.nextPage,
    select: (data) => {
      return data?.pages?.flatMap(({ works }) => works) ?? []
    },
  })

  useEffect(() => {
    if (!isFetchingNextPage && inScrollFinal) {
      fetchNextPage()
    }
  }, [isFetchingNextPage, inScrollFinal, fetchNextPage])

  const hasWorks = works && works.length > 0

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 30 }).map((_, index) => (
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
    <div className="flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 30 }).map((_, index) => (
            <Skeleton
              className="h-[600px] max-w-xl gap-4 rounded"
              key={index}
            />
          ))}
        </div>
      )}
      <div className="h-1 w-full" ref={finalDivInScrollRef}></div>
    </div>
  )
}
