import { useMutation, useQueryClient } from '@tanstack/react-query'
import { filter, flatMap } from 'lodash'
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
} from '@/components/ui/alert-dialog.tsx'
import { worksGalleryQueryKey } from '@/pages/app/works/workGallery.tsx'
import { useUpdateQueryCache } from '@/utils/helpers.ts'

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

  const queryKey = [
    worksGalleryQueryKey,
    { status: params.get('status'), search: params.get('name') },
  ]

  const updateCache = useUpdateQueryCache<{ pages: { works: WorkType[] }[] }>(
    queryKey,
  )

  const { mutate: deleteWorkMutation } = useMutation({
    mutationFn: deleteWork,
    onMutate: (workId) => {
      return updateCache((cache) => {
        return {
          ...cache,
          pages: flatMap(cache?.pages, (page) => {
            return {
              ...page,
              works: filter(page.works, (work) => work?.id !== workId),
            }
          }),
        }
      })
    },
    onSuccess() {
      toast.success('Obra excluída com sucesso')
      void queryClient.invalidateQueries({
        queryKey: ['user-quote'],
      })
    },
    onError(_, __, context) {
      toast.error('Erro ao excluir obra')
      updateCache(context)
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
