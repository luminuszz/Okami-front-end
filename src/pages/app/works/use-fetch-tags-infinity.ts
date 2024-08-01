import { useInfiniteQuery } from '@tanstack/react-query'

import { getTagsPaged, Tag } from '@/api/get-tags-paged.ts'

export interface UseTagsSelectReturn {
  tags: Tag[]
  fetchNextPage: () => void
  isPending: boolean
  isFetching: boolean
}

export function useFetchTagsInfinity(): UseTagsSelectReturn {
  const { data, fetchNextPage, isPending, isFetching } = useInfiniteQuery({
    queryKey: ['tags-select'],
    queryFn: ({ pageParam }) => getTagsPaged(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage === lastPage.totalOfPages
        ? undefined
        : lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.previousPage,
    select: ({ pages }) => {
      return pages.flatMap(({ data }) => data)
    },
  })

  return {
    fetchNextPage,
    isFetching,
    tags: data ?? [],
    isPending,
  }
}
