import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import { WorkType } from '@/api/fetch-for-works-with-filter'
import { useUpdateQueryCache } from '@/utils/helpers'

import { getWorksGalleryQueryKey } from './workGallery'

export type QueryStateCache = {
  pages: Array<{ works: WorkType[] }>
}

export function useUpdateWorkGalleryCache() {
  const [params] = useSearchParams()

  const client = useQueryClient()

  const currentWorksGalleryQueryKey = getWorksGalleryQueryKey(
    params.get('name'),
    params.get('status'),
  )

  function invalidateCurrentQuery() {
    const queryIsFetching = client.isFetching({
      queryKey: currentWorksGalleryQueryKey,
    })

    if (!queryIsFetching) {
      client.invalidateQueries({ queryKey: currentWorksGalleryQueryKey })
    }
  }

  const updateCache = useUpdateQueryCache<QueryStateCache>(
    currentWorksGalleryQueryKey,
  )

  return {
    updateCache,
    currentWorksGalleryQueryKey,
    invalidateCurrentQuery,
  }
}
