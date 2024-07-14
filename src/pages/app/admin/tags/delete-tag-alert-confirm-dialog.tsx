import { useMutation, useQueryClient } from '@tanstack/react-query'
import { filter } from 'lodash'
import { toast } from 'sonner'

import { deleteTag } from '@/api/delete-tag.ts'
import { TagResponse } from '@/api/get-tags-paged.ts'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { getTagsQueryKey } from '@/pages/app/admin/tags/tags.tsx'
import { useGetCurrentPage } from '@/utils/helpers.ts'

export interface DeleteTagConfirmDialogProps {
  tag: {
    id: string
    name: string
    slug: string
  }
}

export function DeleteTagAlertConfirmDialog({
  tag,
}: DeleteTagConfirmDialogProps) {
  const client = useQueryClient()
  const page = useGetCurrentPage()

  const tagQueryKey = [getTagsQueryKey, page] as const
  const mutationKey = ['delete-tag', tag.id] as const

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTag(tag.id),
    mutationKey,
    onSettled() {
      void client.invalidateQueries({
        queryKey: tagQueryKey,
      })
    },

    onMutate() {
      const oldCache = client.getQueryData<TagResponse>(tagQueryKey)

      client.setQueryData(tagQueryKey, () => {
        return {
          ...oldCache,
          data: filter(oldCache?.data, (value) => value.id !== tag.id),
        }
      })

      return oldCache
    },

    onError(_, __, oldCache) {
      client.setQueryData(tagQueryKey, oldCache)
      toast.error('Erro ao excluir a tag')
    },

    onSuccess() {
      toast.success('Tag excluída com sucesso')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Excluir Tag: "{tag.name}" ?
        </AlertDialogTitle>

        <AlertDialogDescription className="my-2 flex items-center text-red-400">
          Essa ação não pode ser desfeita. Isso excluirá permanentemente a Tag
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>

        <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
