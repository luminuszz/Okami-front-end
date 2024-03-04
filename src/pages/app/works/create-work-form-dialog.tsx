import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Book, Tv } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { createWork } from '@/api/create-work'
import { WorkType } from '@/api/fetch-for-works-with-filter'
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
import { compressImageAsync } from '@/lib/imageCompressor'
import { getDefaultImageFile, validateFileType } from '@/lib/utils'

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
    .nullable(),

  imageUrl: z.string().optional(),
})

export type CreateWorkForm = z.infer<typeof createWorkSchema>

export function CreateWorkFormDialog() {
  const [params, setParams] = useSearchParams()
  const queryClient = useQueryClient()

  const currentFilter = params.get('status')

  const form = useForm<CreateWorkForm>({
    resolver: zodResolver(createWorkSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      chapter: 0,
      imageUrl: '/animes-default.jpg',
    },
  })

  const { mutate: createWorkMutation } = useMutation({
    mutationKey: ['create-work'],
    mutationFn: createWork,
    onMutate() {
      const toastId = toast.loading('Adicionando obra')

      queryClient.setQueryData(
        ['works', currentFilter].filter(Boolean),
        (works: WorkType[]) => {
          const values = form.getValues()

          const newWork = {
            category: values.category,
            chapter: values.chapter,
            createdAt: new Date().toISOString(),
            id: Math.random().toString(),
            imageUrl: values.imageUrl ?? '',
            name: values.name,
            hasNewChapter: false,
            imageId: '',
            isDropped: false,
            isFinished: false,
            nextChapterUpdatedAt: null,
            nextChapter: null,
            updatedAt: new Date().toISOString(),
            url: values.url,
            isStales: true,
          }

          return [...works, newWork]
        },
      )

      return toastId
    },

    onSuccess() {
      toast.success('Obra adicionada com sucesso')
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey.includes('works') ||
            query.queryKey.includes('user-quote')
          )
        },
      })

      setParams((params) => {
        params.set('status', 'read')
        params.set('name', '')

        return params
      })
    },
    onError() {
      toast.error('Erro ao adicionar obra')

      queryClient.setQueryData(
        ['works', currentFilter].filter(Boolean),
        (works: any[]) => {
          return works.filter((work) => !work.isStales)
        },
      )
    },

    onSettled(_, __, ___, toastId) {
      console.log('onSettled', toastId)
      toast.dismiss(toastId)
    },
  })

  async function handleCreateWork({ imageFile, ...values }: CreateWorkForm) {
    if (!imageFile) {
      imageFile = await getDefaultImageFile()
    }

    const compressedImage = await compressImageAsync(imageFile)

    const formData = new FormData()

    formData.set('category', values.category)
    formData.set('name', values.name)
    formData.set('chapter', values.chapter.toString())
    formData.set('url', values.url)
    formData.set('file', compressedImage)

    createWorkMutation(formData)
  }

  const category = form.watch('category')

  const needDisableButton =
    form.formState.isSubmitting || !form.formState.isValid

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar obra</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateWork)}
          className="flex flex-col gap-2"
        >
          <div className="m-auto flex h-[200px] w-[200px] justify-center">
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

            <div className="flex flex-col gap-2">
              <Label className="mb-2">Tipo da obra</Label>
              <ComboBox
                disabledSearch
                value={category}
                onSelected={(value) => form.setValue('category', value as any)}
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
    </DialogContent>
  )
}
