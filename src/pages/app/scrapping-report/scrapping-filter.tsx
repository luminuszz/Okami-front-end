import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { ScrapingFilterStatus } from '@/api/fetch-scraping-report.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface ScrapingFilterForm {
  search?: string
  filter?: ScrapingFilterStatus
}

export function ScrappingFilters() {
  const [query, setQuery] = useSearchParams()

  const { register, setValue, reset, handleSubmit, watch } =
    useForm<ScrapingFilterForm>({
      values: {
        filter: query.get('filter') as ScrapingFilterStatus,
        search: query.get('search') ?? '',
      },
    })

  function handleSubmitFilter(data: ScrapingFilterForm) {
    setQuery((query) => {
      if (data.filter) {
        query.set('filter', data.filter)
      }
      if (data.search) {
        query.set('search', data.search)
        query.set('page', String(1))
      }

      return query
    })
  }

  function handleResetFilter() {
    setQuery((query) => {
      query.delete('filter')
      query.delete('search')

      return query
    })

    reset()
  }

  const currentFilter = watch('filter')

  function handleSetStatus(status: ScrapingFilterStatus) {
    setValue(
      'filter',
      currentFilter === status ? ('' as ScrapingFilterStatus) : status,
    )
  }

  return (
    <form
      className="mt-4 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4 md:mt-0"
      onSubmit={handleSubmit(handleSubmitFilter)}
    >
      <Input
        {...register('search')}
        placeholder="Nome da obra"
        className="h-8 w-full max-w-[320px]"
      />

      <Button
        onClick={() => handleSetStatus('PENDING')}
        variant={currentFilter === 'PENDING' ? 'secondary' : 'ghost'}
        data-filter={currentFilter}
        type="button"
      >
        <span className="mr-2 size-2 rounded-full bg-yellow-500"></span>
        Pendente
      </Button>
      <Button
        onClick={() => handleSetStatus('FAILED')}
        variant={currentFilter === 'FAILED' ? 'secondary' : 'ghost'}
        data-filter={currentFilter}
        type="button"
      >
        <span className="mr-2 size-2 rounded-full bg-red-500"></span>
        Falhou
      </Button>

      <Button
        onClick={() => handleSetStatus('SUCCESS')}
        variant={currentFilter === 'SUCCESS' ? 'secondary' : 'ghost'}
        data-filter={currentFilter}
        type="button"
      >
        <span className="mr-2 size-2 rounded-full bg-emerald-500"></span>
        Sincronizado
      </Button>

      <Button variant="secondary" size="sm" type="submit">
        <Search className="mr-1 size-4" />
        Filtrar
      </Button>

      <Button
        className="mt-2 md:mt-0"
        onClick={handleResetFilter}
        type="button"
        variant="outline"
        size="sm"
      >
        <X className="size-4" />
        Remover filtros
      </Button>
    </form>
  )
}
