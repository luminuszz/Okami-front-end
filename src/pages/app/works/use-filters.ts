import { zodResolver } from '@hookform/resolvers/zod'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getWorksGalleryQueryKey } from '@/pages/app/works/workGallery.tsx'

const filterFormSchema = z.object({
  name: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
})

export type FilterForm = z.infer<typeof filterFormSchema>

export function useFilters() {
  const [filter, setFilter] = useSearchParams()
  const queryClient = useQueryClient()

  const fetchingCount = useIsFetching({
    queryKey: getWorksGalleryQueryKey(filter.get('name'), filter.get('status')),
  })

  const { handleSubmit, control, reset, register } = useForm<FilterForm>({
    values: {
      name: filter.get('name') ?? null,
      status: filter.get('status') ?? null,
    },
    resolver: zodResolver(filterFormSchema),
  })

  function handleSetFilter(data: FilterForm) {
    setFilter((filter) => {
      filter.set('name', data.name ?? '')
      filter.set('status', data.status ?? '')

      return filter
    })
  }

  function handleResetFilter() {
    setFilter((filter) => {
      reset()

      filter.delete('name')
      filter.delete('status')

      void queryClient.invalidateQueries({ queryKey: ['works'] })

      return filter
    })
  }

  return {
    handleSubmit,
    control,
    handleSetFilter,
    handleResetFilter,
    register,
    isLoading: fetchingCount > 0,
  }
}
