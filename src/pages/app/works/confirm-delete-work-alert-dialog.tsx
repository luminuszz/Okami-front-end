import { useMutation, useQueryClient } from '@tanstack/react-query'
import { filter } from 'lodash'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { deleteWork } from '@/api/delete-work'
import { WorkType } from '@/api/fetch-for-works-with-filter'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog'

export interface ConfirmDeleteWorkAlertDialogProps {
  work: {
    name: string
    workId: string
  }
}

export function ConfirmDeleteWorkAlertDialog({
  work,
}: ConfirmDeleteWorkAlertDialogProps) {
  const queryClient = useQueryClient()
  const [params] = useSearchParams()

  const currentFilter = params.get('status')

  const queryKey = ['works', currentFilter]

  const { mutate: deleteWorkMutation } = useMutation({
    mutationFn: deleteWork,
    onMutate: (workId) => {
      const cache = queryClient.getQueryData<WorkType[]>(queryKey)

      queryClient.setQueryData<WorkType[]>(queryKey, (works) => {
        return filter(works, (value) => value.id !== workId)
      })

      return cache
    },
    onSuccess() {
      toast.success('Obra excluída com sucesso')
      queryClient.invalidateQueries({
        queryKey: ['user-quote'],
      })
    },
    onError(_, __, context: WorkType[] | undefined) {
      toast.error('Erro ao excluir obra')

      if (context) {
        queryClient.setQueryData<WorkType[]>(queryKey, context)
      }
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir {work.name} ?</AlertDialogTitle>

        <AlertDialogDescription className="my-2 flex items-center text-red-400">
          Essa ação não pode ser desfeita. Isso excluirá permanentemente a obra
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>

        <AlertDialogAction onClick={() => deleteWorkMutation(work.workId)}>
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
