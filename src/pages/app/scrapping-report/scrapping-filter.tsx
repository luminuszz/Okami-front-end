import { useSearchParams } from 'react-router-dom'

import { ScrapingFilterStatus } from '@/api/fetch-scraping-report.ts'
import { Button } from '@/components/ui/button'

export function ScrappingFilters() {
  const [query, setQuery] = useSearchParams()

  function handleSetFilter(filter: ScrapingFilterStatus) {
    setQuery((query) => {
      query.set('filter', filter !== query.get('filter') ? filter : '')

      return query
    })
  }

  const currentFilter = query.get('filter')

  return (
    <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
      <Button
        onClick={() => handleSetFilter('PENDING')}
        variant={currentFilter === 'PENDING' ? 'secondary' : 'ghost'}
        data-filter={currentFilter}
      >
        <span className="mr-2 size-2 rounded-full bg-yellow-500"></span>
        Pendente
      </Button>
      <Button
        onClick={() => handleSetFilter('FAILED')}
        variant={currentFilter === 'FAILED' ? 'secondary' : 'ghost'}
        data-filter={currentFilter}
      >
        <span className="mr-2 size-2 rounded-full bg-red-500"></span>
        Falhou
      </Button>
      <Button
        onClick={() => handleSetFilter('SUCCESS')}
        variant={currentFilter === 'SUCCESS' ? 'secondary' : 'ghost'}
        data-filter={currentFilter}
      >
        <span className="mr-2 size-2 rounded-full bg-emerald-500"></span>
        Sincronizado
      </Button>
    </div>
  )
}
