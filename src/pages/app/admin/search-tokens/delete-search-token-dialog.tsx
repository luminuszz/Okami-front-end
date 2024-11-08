import { useMutation, useQueryClient } from '@tanstack/react-query'
import { filter } from 'lodash'
import { toast } from 'sonner'

import { deleteSearchToken } from '@/api/delete-search-token.ts'
import { SearchToken } from '@/api/get-search-tokens-by-type.ts'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { searchTokenQueryKey } from '@/pages/app/admin/search-tokens/search-tokens.tsx'
import { useUpdateQueryCache } from '@/utils/helpers.ts'

export interface DeleteSearchTokenDialogProps {
  searchToken: {
    id: string
    token: string
    type: string
  }
}

export const deleteSearchTokenMutationKey = 'delete-search-token' as const

export function DeleteSearchTokenDialog({
  searchToken,
}: DeleteSearchTokenDialogProps) {
  const client = useQueryClient()

  const searchTokenQueryKeyWithType = [searchTokenQueryKey, searchToken.type]

  const { updateCache } = useUpdateQueryCache<SearchToken[]>(
    searchTokenQueryKeyWithType,
  )

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSearchToken(searchToken.id),
    mutationKey: searchTokenQueryKeyWithType,
    onSettled() {
      void client.invalidateQueries({
        queryKey: searchTokenQueryKeyWithType,
      })
    },

    onMutate() {
      return updateCache((cache) =>
        filter(cache, (token) => token.id !== searchToken.id),
      )
    },

    onError(_, __, oldCache) {
      updateCache(oldCache)
      toast.error('Erro ao excluir token de busca')
    },

    onSuccess() {
      toast.success('Token de busca excluído com sucesso')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Excluir Token: "{searchToken.token}" ?
        </AlertDialogTitle>

        <AlertDialogDescription className="my-2 flex items-center text-red-400">
          Essa ação não pode ser desfeita. Isso excluirá permanentemente o token
          de busca
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
