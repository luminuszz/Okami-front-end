import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { filter, map } from 'lodash'
import { AlertCircle, Book, BookCheck } from 'lucide-react'
import { useState } from 'react'
import { Label } from 'recharts'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { markWorksAsDropped } from '@/api/mark-work-as-dropped'
import { markWorksAsFinished } from '@/api/mark-works-as-finished'
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

export function MarkWorksAsFinishedDialog() {
  const [selectOption, setSelectOption] = useState('')

  const queryClient = useQueryClient()

  const { data: works, isLoading } = useQuery({
    queryKey: ['works', 'read'],
    queryFn: () => fetchWorksWithFilter('read'),
  })

  const { mutate: markAsFinished } = useMutation({
    mutationKey: ['mark-works-at-finished', selectOption],
    mutationFn: markWorksAsFinished,
    onMutate: (workId) => {
      queryClient.setQueryData<WorkType[]>(['works', 'read'], (works) => {
        return map(works, (work) =>
          work.id === workId ? { ...work, isFinished: true } : work,
        )
      })
    },
  })

  function handleMarkFinished() {
    if (!selectOption) return

    markAsFinished(selectOption)
  }

  return (
    <DialogContent>
      <DialogHeader className="gap-2">
        <DialogTitle>Finalizar obra</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label>Marcar como finalizada</Label>
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
          <Button onClick={handleMarkFinished}>Finalizar</Button>
        </DialogClose>

        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
