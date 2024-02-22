import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function ScrappingFilters() {
  const [query, setQuery] = useSearchParams()

  function handleSetFilter(filter: string) {
    setQuery((query) => {
      query.set('filter', filter !== query.get('filter') ? filter : '')

      return query
    })
  }

  const currentFilter = query.get('filter')

  return (
    <div className="flex items-center gap-4">
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
