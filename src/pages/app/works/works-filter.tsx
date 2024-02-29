import { useQueryClient } from '@tanstack/react-query'
import { Book, BookCheck, BookMarked, Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const filterFormSchema = z.object({
  name: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
})

type FilterForm = z.infer<typeof filterFormSchema>

export function WorksFilter() {
  const queryClient = useQueryClient()

  const [filter, setFilter] = useSearchParams()

  const { handleSubmit, register, control, reset } = useForm<FilterForm>({
    values: {
      name: filter.get('name') ?? null,
      status: filter.get('status') ?? null,
    },
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

      queryClient.invalidateQueries({ queryKey: ['works'] })

      return filter
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleSetFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm  font-semibold">Filtros</span>

      <Input
        placeholder="Nome da obra"
        className="h-8 w-[320px]"
        {...register('name')}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value ?? ''}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unread">
                <div className="flex items-center gap-2">
                  <Book className="size-4" />
                  <span> Não lidos</span>
                </div>
              </SelectItem>
              <SelectItem value="read">
                <div className="flex items-center gap-2">
                  <BookMarked className="size-4" />
                  <span>Lidos</span>
                </div>
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
  )
}
