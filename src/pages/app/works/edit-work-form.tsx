import { zodResolver } from '@hookform/resolvers/zod'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { differenceBy, map } from 'lodash'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'
import { z } from 'zod'

import { getTagsPaged, Tag, tagSchema } from '@/api/get-tags-paged.ts'
import { WorkType } from '@/api/schemas'
import { updateWork } from '@/api/update-work'
import { uploadWorkImage } from '@/api/upload-work-image'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { compressImageAsync } from '@/lib/imageCompressor'
import { getTagColor, validateFileType } from '@/utils/helpers.ts'

import { ImageSelector } from './image-selector'

const editWorkSchema = z.object({
  name: z.string().min(1),
  chapter: z.coerce.number().min(0),
  url: z.string().url(),
  imageFile: z
    .instanceof(FileList)
    .refine(validateFileType, { message: 'Tipo de arquivo invalido' })
    .transform((imageList) => imageList?.length && imageList[0])
    .nullable(),

  imageUrl: z.string().optional(),
  tags: z.array(tagSchema).optional(),
})

export type EditWorkForm = z.infer<typeof editWorkSchema>

interface EditWorkFormDialogProps {
  work: {
    id: string
    name: string
    chapter: number
    url: string
    imageUrl: string
    type: string
    hasNewChapter: boolean
    tags?: Tag[]
  }
}

export function EditWorkFormDialog({ work }: EditWorkFormDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const [ref, inView] = useInView()

  const { data, fetchNextPage, isPending, isFetching } = useInfiniteQuery({
    queryKey: ['tags-select'],
    queryFn: ({ pageParam }) => getTagsPaged(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage === lastPage.totalOfPages
        ? undefined
        : lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.previousPage,
    select: ({ pages }) => {
      return pages.flatMap(({ data }) => data)
    },
  })

  const form = useForm<EditWorkForm>({
    resolver: zodResolver(editWorkSchema),
    values: {
      name: work.name,
      chapter: work.chapter,
      url: work.url,
      imageFile: null,
      imageUrl: work.imageUrl,
      tags: work.tags,
    },
  })

  const { mutateAsync: uploadImageMutation } = useMutation({
    mutationKey: ['upload-work-image', work.id],
    mutationFn: uploadWorkImage,
    onMutate: (formData) => {
      const imageUrl = URL.createObjectURL(formData.get('file') as Blob)

      queryClient.setQueriesData<WorkType[]>(
        {
          queryKey: ['works'],
        },
        (works) =>
          works?.map((item) =>
            item.id === work.id ? { ...item, imageUrl } : item,
          ),
      )
    },
    onSuccess: () => {
      toast.success('Imagem atualizada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar imagem')
    },
  })

  const { mutate: uploadWorkMutation } = useMutation({
    mutationKey: ['update-work', work.id],
    mutationFn: updateWork,
    onSuccess: () => {
      toast.success('Obra atualizada com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar obra')
    },

    onMutate: (payload) => {
      queryClient.setQueriesData<WorkType[]>(
        {
          queryKey: ['works'],
        },
        (works) =>
          works?.map((item) =>
            item.id === work.id ? { ...item, ...payload } : item,
          ),
      )
    },
  })

  async function handleEditWork({ imageFile, ...payload }: EditWorkForm) {
    if (imageFile) {
      const compressedImage = await compressImageAsync(imageFile)

      const formData = new FormData()

      formData.append('file', compressedImage)
      formData.append('id', work.id)

      await uploadImageMutation(formData)
    }

    uploadWorkMutation({
      id: work.id,
      chapter: payload.chapter,
      name: payload.name,
      url: payload.url,
      tagsId: map(payload.tags, 'id'),
    })
  }

  const currentChapterLabel = work.type === 'ANIME' ? 'Episodio' : 'Capitulo'

  const formTags = form.watch('tags') ?? []

  const availableTags = differenceBy(data, formTags, 'id')

  function handleRemoveTag(tagId: string) {
    form.setValue(
      'tags',
      formTags.filter((tag) => tag.id !== tagId),
    )
  }

  useEffect(() => {
    if (!isPending && inView && !isFetching) {
      void fetchNextPage()
    }
  }, [isPending, inView, fetchNextPage, isFetching])

  useEffect(() => {
    return () => {
      form.reset()
    }
  }, [form])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Obra</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEditWork)}
          className="flex flex-col gap-2"
        >
          <div className="m-auto flex h-[300px] w-[300px] justify-center">
            <ImageSelector />
          </div>

          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="one piece" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              render={({ field }) => (
                <>
                  <FormLabel>Tags</FormLabel>

                  <Popover open={open} onOpenChange={setOpen}>
                    <div className="flex items-center justify-between ">
                      <div className="space-x-1">
                        {field?.value?.map((tag) => {
                          return (
                            <Badge
                              key={tag.id}
                              className="text-gray-100"
                              style={{ background: getTagColor(tag.color) }}
                              variant="outline"
                            >
                              <X
                                onClick={() => handleRemoveTag(tag.id)}
                                className="mr-2 size-4 cursor-pointer"
                              />
                              <p>{tag.name}</p>
                            </Badge>
                          )
                        })}
                      </div>

                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2">
                          <Plus className="size-4" />
                        </Button>
                      </PopoverTrigger>
                    </div>

                    <PopoverContent align="center">
                      <Command>
                        <CommandInput
                          placeholder="Pesquisar tags..."
                          isPending={isPending || isFetching}
                        />
                        <CommandEmpty>Sem tags</CommandEmpty>
                        <CommandList>
                          {availableTags?.map((tag) => (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => {
                                form.setValue('tags', [...formTags, tag])
                              }}
                            >
                              <Badge
                                className="space-y-1 text-gray-100"
                                style={{ background: getTagColor(tag.color) }}
                                variant="outline"
                              >
                                {tag.name}
                              </Badge>
                            </CommandItem>
                          ))}
                          <div ref={ref}></div>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </>
              )}
              name="tags"
            />

            <FormField
              control={form.control}
              name="chapter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{currentChapterLabel}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={work.hasNewChapter}
                      type="number"
                      placeholder="120"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="anime.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Salvar
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
