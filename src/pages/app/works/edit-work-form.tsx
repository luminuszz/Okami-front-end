import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { WorkType } from '@/api/schemas'
import { updateWork } from '@/api/update-work'
import { uploadWorkImage } from '@/api/upload-work-image'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { compressImageAsync } from '@/lib/imageCompressor'
import { validateFileType } from '@/lib/utils'

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
  }
}

export function EditWorkFormDialog({ work }: EditWorkFormDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<EditWorkForm>({
    resolver: zodResolver(editWorkSchema),
    values: {
      name: work.name,
      chapter: work.chapter,
      url: work.url,
      imageFile: null,
      imageUrl: work.imageUrl,
    },
  })

  const { mutate: uploadImageMutation } = useMutation({
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

      uploadImageMutation(formData)
    }

    uploadWorkMutation({
      id: work.id,
      chapter: payload.chapter,
      name: payload.name,
      url: payload.url,
    })
  }

  const currentChapterLabel = work.type === 'ANIME' ? 'Episodio' : 'Capitulo'

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
            <DialogClose asChild>
              <Button
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isDirty ||
                  !form.formState.isValid
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
