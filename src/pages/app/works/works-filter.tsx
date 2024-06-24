import { Book, BookCheck, BookMarked, Search, X } from 'lucide-react'
import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilters } from '@/pages/app/works/use-filters.ts'

import { MobileWorkFilters } from './mobile-works-filter'

export function WorksFilter() {
  const {
    handleSetFilter,
    handleResetFilter,
    handleSubmit,
    control,
    register,
  } = useFilters()

  return (
    <>
      <div className="flex md:hidden">
        <MobileWorkFilters />
      </div>
      <form
        onSubmit={handleSubmit(handleSetFilter)}
        className="hidden items-center gap-2 md:flex"
      >
        <span className="text-sm  font-semibold">Filtros</span>

        <Input
          placeholder="Nome da obra"
          className="h-8 w-full max-w-[320px]"
          {...register('name')}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <SelectTrigger className="h-8 w-full max-w-[180px] ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unread">
                  <span>
                    <div className="flex items-center gap-2">
                      <Book className="size-4" />
                      <span>Não lidos</span>
                    </div>
                  </span>
                </SelectItem>
                <SelectItem value="read">
                  <span>
                    <div className="flex items-center gap-2">
                      <BookMarked className="size-4" />
                      <span>Lidos</span>
                    </div>
                  </span>
                </SelectItem>

                <SelectItem value="finished">
                  <div className="flex items-center gap-2">
                    <BookCheck className="size-4" />
                    <span>Finalizados</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Button variant="secondary" size="sm" type="submit">
          <Search className="mr-1 size-4" />
          Filtrar Resultados
        </Button>

        <Button
          onClick={handleResetFilter}
          type="button"
          variant="outline"
          size="sm"
        >
          <X className="mr-1 size-4" />
          Remover filtros
        </Button>
      </form>
    </>
  )
}
