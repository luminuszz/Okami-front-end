import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { differenceBy, map } from 'lodash'
import { Tag as TagIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import { createTag } from '@/api/create-tag.ts'
import { Tag, TagResponse } from '@/api/get-tags-paged.ts'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTagsQueryKey } from '@/pages/app/admin/tags.tsx'

type ColorKey = keyof typeof colors

const excludeColors = ['black', 'white', 'transparent', 'inherit', 'current']

const availableColors = differenceBy(Object.keys(colors), excludeColors) as [
  ColorKey,
]

const options = availableColors.map((color) => ({
  color,
  label: color.replace(/([A-Z])/g, ' $1').toLowerCase(),
}))

const createTagSchema = z.object({
  name: z.string().min(1).max(255),
  color: z.enum(availableColors),
})

type CreateTagForm = z.infer<typeof createTagSchema>

export function CreateTagDialog() {
  const client = useQueryClient()

  const form = useForm<CreateTagForm>({
    resolver: zodResolver(createTagSchema),
    values: {
      color: 'inherit',
      name: '',
    },
  })

  const createTagMutation = useMutation({
    mutationFn: createTag,
    mutationKey: ['create-tag'],
    onError(_, __, tagId) {
      toast.error('Houve um erro ao criar a tag')

      client.setQueryData<TagResponse>([getTagsQueryKey], (cache) => {
        if (!cache) return cache

        cache.data = cache.data.filter((tag) => tag.id !== tagId)

        return cache
      })
    },
    onSettled() {
      void client.invalidateQueries({
        queryKey: [getTagsQueryKey],
      })
    },
    onSuccess() {
      toast.success('Tag busca criado com sucesso')
    },
    onMutate(args) {
      const tag: Tag = {
        name: args.name,
        color: args.color,
        slug: args.name,
        id: Math.random().toString(),
      }

      client.setQueryData<TagResponse>([getTagsQueryKey], (cache) => {
        if (!cache) return cache

        cache.data.push(tag)

        return cache
      })

      return tag.id
    },
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <TagIcon className="size-4" />
          <span>Adicionar nova tag</span>
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            createTagMutation.mutate(values),
          )}
          className="space-y-4"
        >
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
          <DialogClose asChild className="mt-2">
            <Button
              disabled={!form.formState.isValid && createTagMutation.isPending}
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
