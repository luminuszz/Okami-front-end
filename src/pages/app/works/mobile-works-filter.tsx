import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Book, BookCheck, BookMarked, Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
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

export function MobileWorkFilters() {
  const queryClient = useQueryClient()

  const [filter, setFilter] = useSearchParams()

  const { handleSubmit, control, reset } = useForm<FilterForm>({
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

      queryClient.invalidateQueries({ queryKey: ['works'] })

      return filter
    })
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary">
          <Search className="mr-2 size-4 text-muted-foreground" />
          Filtrar obras
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar obras</DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(handleSetFilter)}
          className="flex flex-1 flex-col gap-2 px-2"
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                placeholder="Nome da obra"
                className="h-8 w-full"
                {...field}
                onChange={field.onChange}
                value={field.value ?? ''}
                onBlur={field.onBlur}
              />
            )}
          ></Controller>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger className="h-8 w-full  ">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent align="center">
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

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary" size="sm" type="submit">
                <Search className="mr-1 size-4" />
                Filtrar Resultados
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                onClick={handleResetFilter}
                type="button"
                variant="outline"
                size="sm"
              >
                <X className="mr-1 size-4" />
                Remover filtros
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
