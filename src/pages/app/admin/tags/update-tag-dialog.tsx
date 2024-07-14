import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { map } from 'lodash'
import { Tag as TagIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import { Tag, TagResponse } from '@/api/get-tags-paged.ts'
import { updateTag } from '@/api/update-tag.ts'
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
import { getTagsQueryKey } from '@/pages/app/admin/tags/tags.tsx'
import {
  ColorKey,
  getAvailableTagColors,
  parsePageQuery,
} from '@/utils/helpers.ts'

const availableColors = getAvailableTagColors()

const options = availableColors.map((color) => ({
  color,
  label: color.replace(/([A-Z])/g, ' $1').toLowerCase(),
}))

const updateTagSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  color: z.enum(availableColors).optional(),
})

type UpdateFormTag = z.infer<typeof updateTagSchema>

export type CreateTagDialogProps = {
  tag: {
    id: string
    color: string
    name: string
  }
}

export function UpdateTagDialog({ tag }: CreateTagDialogProps) {
  const client = useQueryClient()

  const form = useForm<UpdateFormTag>({
    resolver: zodResolver(updateTagSchema),
    defaultValues: {
      name: tag.name,
      color: tag.color as ColorKey,
    },
  })

  const [params] = useSearchParams()

  const currentTagsQueryKey = [
    getTagsQueryKey,
    parsePageQuery(params.get('page')),
  ]

  const updateTagMutation = useMutation({
    mutationFn: updateTag,
    mutationKey: ['update-tag'],
    onError(_, __, oldCache?: TagResponse) {
      toast.error('Houve um erro ao editar a tag')

      client.setQueryData(currentTagsQueryKey, oldCache)
    },
    onSettled() {
      void client.invalidateQueries({
        queryKey: currentTagsQueryKey,
      })
    },
    onSuccess() {
      toast.success('Tag editada com sucesso')
    },
    onMutate(args) {
      return uploadCache({
        name: args.name,
        color: args.color,
        id: args.id,
      })
    },
  })

  function handleSubmit(values: UpdateFormTag) {
    const parsedName = values?.name === tag.name ? undefined : values.name

    updateTagMutation.mutate({
      id: tag.id,
      color: values.color,
      name: parsedName,
    })
  }

  function uploadCache(tagUpdated: Partial<Tag>) {
    const oldCache = client.getQueryData<TagResponse>(currentTagsQueryKey)

    client.setQueryData(currentTagsQueryKey, () => {
      const tags = oldCache?.data?.map((item) => {
        if (item.id === tagUpdated.id) {
          return {
            ...item,
            name: tagUpdated.name ?? item.name,
            color: tagUpdated.color ?? item.color,
          }
        }

        return item
      })

      return {
        ...oldCache,
        data: tags ?? [],
      }
    })

    return oldCache
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <TagIcon className="size-4" />
          <span>Editar Tag</span>
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor da tag</FormLabel>
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
                    {map(options, (option) => (
                      <SelectItem value={option.color}>
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              backgroundColor: colors[option.color][600],
                            }}
                            className="size-4 rounded-full bg-[data-bgColor]"
                          ></span>

                          <p className="text-sm text-muted-foreground">
                            {option.label}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <DialogClose asChild className="mt-2">
              <Button
                variant="ghost"
                disabled={
                  !form.formState.isValid && updateTagMutation.isPending
                }
              >
                Cancelar
              </Button>
            </DialogClose>

            <DialogClose asChild className="mt-2">
              <Button
                disabled={
                  !form.formState.isValid && updateTagMutation.isPending
                }
                type="submit"
              >
                Salvar
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
