import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { find, map } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
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

  const currentWork = useMemo(
    () => find(works, { id: selectOption }) ?? null,
    [works, selectOption],
  )

  const { mutate: markAsFinished, isPending } = useMutation({
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
      queryClient.invalidateQueries({
        queryKey: ['works', 'finished'],
      })

      setSelectOption('')
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

      {currentWork && (
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            className="size-[250px] rounded-sm"
            src={currentWork.imageUrl ?? ''}
            alt={currentWork.name}
          />
          <p className="text-center text-foreground">{`${currentWork.name}`}</p>
          {currentWork.alternativeName && (
            <span className="text-muted-foreground">
              {currentWork.alternativeName}
            </span>
          )}
        </div>
      )}

      <DialogFooter className="flex-col gap-4 md:flex-row">
        <DialogClose asChild>
          <Button
            disabled={!selectOption || isPending}
            onClick={handleMarkFinished}
          >
            Finalizar
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button disabled={!selectOption} variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
