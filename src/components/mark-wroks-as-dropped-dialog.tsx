import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { filter, map } from 'lodash'
import { AlertCircle, Book, BookCheck } from 'lucide-react'
import { useState } from 'react'
import { Label } from 'recharts'
import { toast } from 'sonner'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { markWorksAsDropped } from '@/api/mark-work-as-dropped'
import { WorkType } from '@/api/schemas'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export function MarkWorksAsDroppedDialog() {
  const [selectOption, setSelectOption] = useState('')

  const queryClient = useQueryClient()

  const { data: works, isLoading } = useQuery({
    queryKey: ['works', 'read'],
    queryFn: () => fetchWorksWithFilter('read'),
  })

  const { mutate: markAsDropped } = useMutation({
    mutationKey: ['mark-works-at-dropped', selectOption],
    mutationFn: markWorksAsDropped,
    onMutate: (workId) => {
      queryClient.setQueryData<WorkType[]>(['works', 'read'], (works) => {
        return filter(works, (value) => value.id !== workId)
      })
    },
    onSuccess: () => {
      toast.success('Obra dropada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao dropar obra')
    },
  })

  function handleMarkDropped() {
    if (!selectOption) return

    markAsDropped(selectOption)
  }

  return (
    <DialogContent>
      <DialogHeader className="gap-2">
        <DialogTitle>Dropar obra</DialogTitle>
        <DialogDescription className="my-2 flex items-center text-red-400">
          <AlertCircle className="mr-2 size-4 text-muted-foreground text-red-400" />
          Ao dropar a obra, ela não será mais sincronizada.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label>Marcar como Dropada</Label>
        <Select
          disabled={isLoading}
          onValueChange={(option) => setSelectOption(option)}
          value={selectOption}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleciona a obra" />
          </SelectTrigger>
          <SelectContent align="center">
            {map(works, (work) => (
              <SelectItem value={work.id} key={work.id} className="truncate">
                {work.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="destructive" onClick={handleMarkDropped}>
            Dropar
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
