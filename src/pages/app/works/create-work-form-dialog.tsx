import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { differenceBy, filter, map } from 'lodash'
import { Book, Tv } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { createWork } from '@/api/create-work'
import { tagSchema } from '@/api/get-tags-paged.ts'
import { ComboBox } from '@/components/combobox'
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
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { compressImageAsync } from '@/lib/imageCompressor'
import { TagsSelect } from '@/pages/app/works/tags-select.tsx'
import { useFetchTagsInfinity } from '@/pages/app/works/use-fetch-tags-infinity.ts'
import { worksGalleryQueryKey } from '@/pages/app/works/workGallery.tsx'
import {
  getDefaultImageFile,
  normalizeString,
  useDebounceState,
  validateFileType,
} from '@/utils/helpers.ts'

import { ImageSelector } from './image-selector'

const createWorkSchema = z.object({
  name: z.string().min(1),
  chapter: z.coerce.number().min(0),
  url: z.string().url(),
  category: z.enum(['MANGA', 'ANIME']),
  imageFile: z
    .instanceof(FileList)
    .refine(validateFileType, { message: 'Tipo de arquivo invalido' })
    .transform((imageList) => imageList?.length && imageList[0])
    .nullable()
    .optional()
    .default(null),

  imageUrl: z.string().optional(),
  tags: z.array(tagSchema),
  alternativeName: z.string().optional(),
})

export type CreateWorkForm = z.infer<typeof createWorkSchema>

export function CreateWorkFormDialog() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useDebounceState('', 300)

  const parsedSearch = useMemo(() => normalizeString(search), [search])

  const { tags, fetchNextPage } = useFetchTagsInfinity({ search: parsedSearch })

  const queryClient = useQueryClient()

  async function updateWorkGalleryCache() {
    await queryClient.invalidateQueries({
      queryKey: [
        worksGalleryQueryKey,
        { status: params.get('status'), search: params.get('name') },
      ],
      predicate: (query) => query.queryKey.includes('user-quote'),
    })
  }

  const form = useForm<CreateWorkForm>({
    resolver: zodResolver(createWorkSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      chapter: 0,
      imageUrl: '/animes-default.jpg',
      tags: [],
      alternativeName: '',
    },
  })

  const { mutate: createWorkMutation } = useMutation({
    mutationKey: ['create-work'],
    mutationFn: createWork,
    async onSuccess() {
      toast.success('Obra adicionada com sucesso')

      await updateWorkGalleryCache()

      setParams((params) => {
        params.set('status', 'read')
        params.set('name', '')

        return params
      })

      form.reset()
    },

    onError() {
      toast.error('Erro ao adicionar obra')
    },
  })

  async function handleCreateWork({ imageFile, ...values }: CreateWorkForm) {
    try {
      if (!imageFile) {
        imageFile = await getDefaultImageFile()
      }

      const compressedImage = await compressImageAsync(imageFile)
      const formData = new FormData()

      formData.append('category', values.category)
      formData.append('name', values.name)
      formData.append('chapter', values.chapter.toString())
      formData.append('url', values.url)
      formData.append('file', compressedImage)

      if (values.tags.length) {
        formData.append('tagsId', map(values.tags, 'id').join(','))
      }

      formData.append('alternativeName', values.alternativeName ?? '')

      createWorkMutation(formData)
    } catch (error) {
      console.log(error)
      toast.error('Houve um erro ao criar a obra')
    }
  }

  const category = form.watch('category')

  const needDisableButton =
    form.formState.isSubmitting || !form.formState.isValid

  return (
    <DialogContent className="mx-2 ">
      <DialogHeader>
        <DialogTitle>Adicionar obra</DialogTitle>
      </DialogHeader>

      <ScrollArea className="h-[600px] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateWork)}
            className="flex flex-col gap-2"
          >
            <div className="m-auto flex h-[200px] w-full max-w-[200px] justify-center">
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
                      <Input placeholder="ex: one piece" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternativeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome alternativo</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: aventuras de luffy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <Label className="mb-2">Tipo da obra</Label>
                <ComboBox
                  disabledSearch
                  value={category}
                  onSelected={(value) =>
                    form.setValue(
                      'category',
                      value as CreateWorkForm['category'],
                    )
                  }
                  options={[
                    {
                      label: 'Manga',
                      value: 'MANGA',
                      icon: <Book className="size-4" />,
                    },
                    {
                      label: 'Anime',
                      value: 'ANIME',
                      icon: <Tv className="size-4" />,
                    },
                  ]}
                />
              </div>

              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel>Tags</FormLabel>
                    <TagsSelect
                      onSearch={setSearch}
                      options={differenceBy(tags, field.value, 'id')}
                      onEndReached={fetchNextPage}
                      handleRemoveTag={(tagId) => {
                        field.onChange(
                          filter(field.value, (tag) => tag.id !== tagId),
                        )
                      }}
                      handleAddTag={(tags) => {
                        field.onChange(tags)
                      }}
                      value={field.value}
                    />
                  </>
                )}
                name="tags"
              />

              <FormField
                control={form.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episódio / Capítulo</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
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
                      <Input
                        type="url"
                        placeholder="http://anime.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose asChild className="mt-2">
                <Button disabled={needDisableButton} type="submit">
                  Adicionar
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </DialogContent>
  )
}
