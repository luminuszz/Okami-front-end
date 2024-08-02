import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { chain } from 'lodash'
import { useCallback } from 'react'

import { filterTagsBySearch } from '@/api/filter-tags-by-search.ts'
import { getTagsPaged, Tag } from '@/api/get-tags-paged.ts'

export interface UseTagsSelectReturn {
  tags: Tag[]
  fetchNextPage: () => void
}

export interface UseTagsSelectParams {
  search?: string
}

export function useFetchTagsInfinity({
  search = '',
}: UseTagsSelectParams): UseTagsSelectReturn {
  const { data, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['tags-select-infinity'],
      queryFn: ({ pageParam }) => getTagsPaged(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.nextPage === lastPage.totalOfPages
          ? undefined
          : lastPage.nextPage,
      getPreviousPageParam: (firstPage) => firstPage.previousPage,
      select({ pages }) {
        return chain(pages)
          .flatMap((page) => page.data)
          .unionBy('id')
          .value()
      },
    })

  const { data: filteredTags = [], isFetching: isFetchingTagsSelectSearch } =
    useQuery({
      queryKey: ['tags-select-search', search],
      queryFn: () => filterTagsBySearch(search),
      enabled: !!search,
    })

  const handleFetchNextPage = useCallback(() => {
    const searchQueryIsNotFetching = !isFetchingTagsSelectSearch && !search
    const noHavePageFetching = !isFetchingNextPage && !isPending

    const canSearchNextPage = searchQueryIsNotFetching && noHavePageFetching

    if (canSearchNextPage) {
      void fetchNextPage()
    }
  }, [
    fetchNextPage,
    isFetchingNextPage,
    isFetchingTagsSelectSearch,
    isPending,
    search,
  ])

  return {
    fetchNextPage: handleFetchNextPage,
    tags: filteredTags?.length ? filteredTags : data?.flat() ?? [],
  }
}
