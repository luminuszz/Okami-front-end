import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { flatMap } from 'lodash'
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
  const {
    data: tagsFromInfinityQuery = [],
    fetchNextPage,
    isPending,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['tags-select-infinity'],
    queryFn: ({ pageParam }) => getTagsPaged(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage === lastPage.totalOfPages
        ? undefined
        : lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.previousPage,
    select({ pages }) {
      return flatMap(pages, (page) => page.data)
    },
    staleTime: Infinity,
  })

  const { data: filteredTags, isFetching: isFetchingTagsSelectSearch } =
    useQuery({
      queryKey: ['tags-select-search', search],
      queryFn: () => filterTagsBySearch(search),
      enabled: !!search,
      initialData: [],
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

  const currentTags = search ? filteredTags : tagsFromInfinityQuery

  return {
    fetchNextPage: handleFetchNextPage,
    tags: currentTags,
  }
}
