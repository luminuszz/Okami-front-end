import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { map } from 'lodash'
import { useEffect, useState } from 'react'
import { Label } from 'recharts'
import { toast } from 'sonner'

import { fetchWorksWithFilter } from '@/api/fetch-for-works-with-filter'
import { markWorksAsFinished } from '@/api/mark-works-as-finished'
import { WorkType } from '@/api/schemas'

import { ComboBox } from './combobox'
import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export function MarkWorksAsFinishedDialog() {
  const [selectOption, setSelectOption] = useState('')

  const queryClient = useQueryClient()

  const { data: works, isLoading } = useQuery({
    queryKey: ['works', 'read'],
    queryFn: () => fetchWorksWithFilter({ status: 'read' }),
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
    onSuccess: () => {
      toast.success('Obra finalizada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao finalizar obra')
    },
  })

  const options = map(works, (work) => ({
    label: work.name,
    value: work.id,
  }))

  function handleMarkFinished() {
    if (!selectOption) return

    markAsFinished(selectOption)
  }

  useEffect(() => {
    return () => {
      setSelectOption('')
    }
  }, [])

  return (
    <DialogContent className="mx-2">
      <DialogHeader className="gap-2">
        <DialogTitle>Finalizar obra</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label>Marcar como finalizada</Label>
        <ComboBox
          disabled={isLoading}
          options={options}
          value={selectOption}
          onSelected={setSelectOption}
        />
      </div>

      <DialogFooter className="flex-col gap-4 md:flex-row">
        <Button disabled={!selectOption} onClick={handleMarkFinished}>
          Finalizar
        </Button>

        <DialogClose asChild>
          <Button disabled={!selectOption} variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
