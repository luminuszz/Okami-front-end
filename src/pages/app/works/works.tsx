import { Dialog } from '@radix-ui/react-dialog'
import { Book, BookCheck } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
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

import { WorkGallery } from './workGallery'

const filterFormSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
})

type FilterForm = z.infer<typeof filterFormSchema>

export function Works() {
  const [filter, setFilter] = useSearchParams()

  const { handleSubmit, register, control } = useForm<FilterForm>({
    values: {
      name: filter.get('name') ?? '',
      status: filter.get('status') ?? 'unread',
    },
  })

  async function handleSetFilter(data: FilterForm) {
    setFilter((filter) => {
      filter.set('name', data.name ?? '')
      filter.set('status', data.status ?? '')

      return filter
    })
  }

  return (
    <Dialog>
      <Helmet title="obras atualizadas" />

      <div className=" flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tighter">
          Obras Atualizadas
        </h1>

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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Seleciona o status" />
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
                      <BookCheck className="size-4" />
                      <span>Lidos</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Button variant="outline" size="sm" type="submit">
            Filtrar
          </Button>
        </form>

        <main className="flex justify-center ">
          <WorkGallery />
        </main>
      </div>
    </Dialog>
  )
}
