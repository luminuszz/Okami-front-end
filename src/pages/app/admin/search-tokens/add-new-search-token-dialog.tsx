import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { createSearchToken } from '@/api/create-search-token.ts'
import {
  SearchToken,
  SearchtokenType,
} from '@/api/get-search-tokens-by-type.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import {
  searchTokenQueryKey,
  searchTokenTypeParam,
} from '@/pages/app/admin/search-tokens/search-tokens.tsx'

const createSearchTokenSchema = z.object({
  token: z.string().min(1),
  type: z.enum(['ANIME', 'MANGA']),
})

type CreateFormToken = z.infer<typeof createSearchTokenSchema>

export function AddNewSearchTokenDialog() {
  const client = useQueryClient()

  const [, setParams] = useSearchParams()

  const form = useForm<CreateFormToken>({
    resolver: zodResolver(createSearchTokenSchema),
    values: {
      token: '',
      type: 'MANGA',
    },
  })

  const createSearchTokenMutation = useMutation({
    mutationFn: createSearchToken,
    mutationKey: ['createSearchToken'],
    onError() {
      toast.error('Houve um erro ao criar o token de busca')
    },
    onSettled(_, __, vars) {
      form.reset()
      void client.invalidateQueries({
        queryKey: ['search-tokens', vars.type],
      })
    },
    onSuccess() {
      toast.success('Token de busca criado com sucesso')
    },
    onMutate(args) {
      client.setQueryData(
        [searchTokenQueryKey, args.type],
        (old: SearchToken[] = []) => {
          const payload: SearchToken = {
            token: args.token,
            type: args.type as SearchtokenType,
            id: Date.now().toString(),
            createdAt: new Date(),
          }

          return [...old, payload]
        },
      )
      setParams((params) => {
        params.set(searchTokenTypeParam, args.type)

        return params
      })
    },
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Plus className="size-4" />
          <span>Adicionar novo token de busca</span>
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            createSearchTokenMutation.mutate(values)
          })}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Token</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ANIME">Anime</SelectItem>
                    <SelectItem value="MANGA">Manga</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose asChild className="mt-2">
            <Button
              disabled={
                !form.formState.isValid && createSearchTokenMutation.isPending
              }
              type="submit"
            >
              Adicionar
            </Button>
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  )
}
