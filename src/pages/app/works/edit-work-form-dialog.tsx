import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { differenceBy, map } from 'lodash'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Tag, tagSchema } from '@/api/get-tags-paged.ts'
import { WorkType } from '@/api/schemas'
import { updateWork } from '@/api/update-work'
import { uploadWorkImage } from '@/api/upload-work-image'
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
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { compressImageAsync } from '@/lib/imageCompressor'
import { TagsSelect } from '@/pages/app/works/tags-select.tsx'
import { useFetchTagsInfinity } from '@/pages/app/works/use-fetch-tags-infinity.ts'
import { worksGalleryQueryKey } from '@/pages/app/works/workGallery.tsx'
import {
  useDebounceState,
  useUpdateQueryCache,
  validateFileType,
} from '@/utils/helpers.ts'

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
  tags: z.array(tagSchema),
  alternativeName: z.string().optional(),
})

export type EditWorkFormDialog = z.infer<typeof editWorkSchema>

interface EditWorkFormDialogProps {
  work: {
    id: string
    name: string
    chapter: number
    url: string
    imageUrl: string
    type: string
    hasNewChapter: boolean
    tags: Tag[]
    alternativeName: string | null
  }
}

export function EditWorkFormDialog({ work }: EditWorkFormDialogProps) {
  const [search, setSearch] = useDebounceState('', 300)
  const [params] = useSearchParams()

  const { updateCache: updateWorksWithFilterCache } = useUpdateQueryCache<
    WorkType[]
  >([
    worksGalleryQueryKey,
    { search: params.get('name'), status: params.get('status') },
  ])

  const { fetchNextPage, tags } = useFetchTagsInfinity({
    search,
  })

  const form = useForm<EditWorkFormDialog>({
    resolver: zodResolver(editWorkSchema),
    values: {
      name: work.name,
      chapter: work.chapter,
      url: work.url,
      imageFile: null,
      imageUrl: work.imageUrl,
      tags: work.tags ?? [],
      alternativeName: work.alternativeName ?? '',
    },
  })

  const { mutateAsync: uploadImageMutation } = useMutation({
    mutationKey: ['upload-work-image', work.id],
    mutationFn: uploadWorkImage,
    onMutate: (formData) => {
      const imageUrl = URL.createObjectURL(formData.get('file') as Blob)
      return updateWorksWithFilterCache((cache) => {
        return map(cache, (item) =>
          item.id === work.id ? { ...item, imageUrl } : item,
        )
      })
    },
    onSuccess: async () => {
      toast.success('Imagem atualizada com sucesso')
    },
    onError: (_, __, oldCache) => {
      updateWorksWithFilterCache(oldCache)
    },
  })

  const { mutate: updateWorkMutation } = useMutation({
    mutationKey: ['update-work', work.id],
    mutationFn: updateWork,
    async onSuccess() {
      toast.success('Obra atualizada com sucesso')
    },
    onError(_, __, oldCache) {
      toast.error('Erro ao atualizar obra')
      updateWorksWithFilterCache(oldCache as WorkType[])
    },

    onMutate(payload) {
      return updateWorksWithFilterCache((cache) => {
        return map(cache, (work) =>
          work.id === payload.id
            ? { ...work, ...payload, tags: form.getValues('tags') }
            : work,
        )
      })
    },
  })

  async function handleEditWork({ imageFile, ...payload }: EditWorkFormDialog) {
    if (imageFile) {
      const compressedImage = await compressImageAsync(imageFile)

      const formData = new FormData()

      formData.append('file', compressedImage)
      formData.append('id', work.id)

      await uploadImageMutation(formData)
    }

    updateWorkMutation({
      id: work.id,
      chapter: payload.chapter,
      name: payload.name,
      url: payload.url,
      tagsId: map(payload.tags, 'id'),
      alternativeName: payload.alternativeName,
    })
  }

  const currentChapterLabel = work.type === 'ANIME' ? 'Episodio' : 'Capitulo'

  function handleRemoveTag(tagId: string, formTags: Tag[]) {
    form.setValue(
      'tags',
      formTags.filter((tag) => tag.id !== tagId),
    )
  }

  return (
    <DialogContent onCloseAutoFocus={() => form.reset()}>
      <DialogHeader>
        <DialogTitle>Editar Obra</DialogTitle>
      </DialogHeader>

      <ScrollArea className="h-[712px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditWork)}
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
                      <Input placeholder="ex:one piece" {...field} />
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

              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel>Tags</FormLabel>
                    <TagsSelect
                      onSearch={setSearch}
                      options={differenceBy(tags, field.value, 'id')}
                      onEndReached={fetchNextPage}
                      handleRemoveTag={(tagId) =>
                        handleRemoveTag(tagId, field.value)
                      }
                      handleAddTag={(tags) => {
                        field.onChange(tags)
                      }}
                      value={field.value ?? []}
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
      </ScrollArea>
    </DialogContent>
  )
}
