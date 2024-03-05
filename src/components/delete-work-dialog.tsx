import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { filter, map } from 'lodash'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Label } from 'recharts'
import { toast } from 'sonner'

import { deleteWork } from '@/api/delete-work'
import {
  fetchWorksWithFilter,
  WorkType,
} from '@/api/fetch-for-works-with-filter'

import { ComboBox } from './combobox'
import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export function DeleteWorkDialog() {
  const [selectOption, setSelectOption] = useState('')

  const [params] = useSearchParams()

  const queryClient = useQueryClient()

  const { data: works, isLoading } = useQuery({
    queryKey: ['works', 'read'],
    queryFn: () => fetchWorksWithFilter({ status: 'read' }),
  })

  const currentFilter = params.get('status')

  const { mutate: deleteWorkMutation } = useMutation({
    mutationFn: deleteWork,
    onMutate: (workId) => {
      queryClient.setQueryData<WorkType[]>(
        ['works', currentFilter].filter(Boolean),
        (works) => {
          return filter(works, (value) => value.id !== workId)
        },
      )
    },
    onSuccess() {
      toast.success('Obra excluída com sucesso')
      queryClient.invalidateQueries({
        queryKey: ['user-quote'],
      })
    },
    onError() {
      toast.error('Erro ao excluir obra')

      queryClient.invalidateQueries({ queryKey: ['works', 'read'] })
    },
  })

  function handleDeleteWork() {
    if (!selectOption) return

    deleteWorkMutation(selectOption)
  }

  const options = map(works, (work) => ({
    label: work.name,
    value: work.id,
  }))

  useEffect(() => {
    return () => {
      setSelectOption('')
    }
  }, [])

  return (
    <DialogContent>
      <DialogHeader className="gap-2">
        <DialogTitle>Dropar obra</DialogTitle>
        <DialogDescription className="my-2 flex items-center text-red-400">
          <AlertCircle className="mr-2 size-4 text-muted-foreground text-red-400" />
          Ao excluir a obra, ela não será mais sincronizada.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label>Excluir obra</Label>
        <ComboBox
          disabled={isLoading}
          value={selectOption}
          onSelected={setSelectOption}
          options={options}
        />
      </div>

      <DialogFooter>
        <Button
          disabled={!selectOption}
          variant="destructive"
          onClick={handleDeleteWork}
        >
          Excluir
        </Button>

        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
