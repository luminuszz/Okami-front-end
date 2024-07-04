import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getUserDetails, GetUserDetailsType } from '@/api/get-user-details'
import { updateUserCall } from '@/api/update-user'
import { uploadAvatarImage } from '@/api/upload-avatar-image'
import { compressImageAsync } from '@/lib/imageCompressor'
import { isFileList } from '@/utils/helpers.ts'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Input } from './ui/input'
import { Label } from './ui/label'

const editProfileSchema = z.object({
  name: z.string().min(3, 'Nome inválido'),
  avatar: z.string().url().or(z.instanceof(FileList)).optional(),
  email: z.string().email('E-mail válido').optional(),
})

type EditProfileFormType = z.infer<typeof editProfileSchema>

export function EditProfileDialog() {
  const queryClient = useQueryClient()

  const { data: userDetails } = useQuery({
    queryKey: ['user-details'],
    queryFn: getUserDetails,
  })

  function uploadCache(user?: Partial<GetUserDetailsType>) {
    const cache = queryClient.getQueryData<GetUserDetailsType>(['user-details'])

    queryClient.setQueryData<GetUserDetailsType>(['user-details'], () => {
      if (!user || !cache) return

      return {
        ...cache,
        ...user,
      }
    })

    return cache
  }

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, dirtyFields },
  } = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileSchema),
    values: {
      avatar: userDetails?.avatarImageUrl ?? '',
      name: userDetails?.name ?? '',
      email: userDetails?.email ?? '',
    },
  })

  const avatar = watch('avatar')

  const avatarImageUrl = isFileList(avatar)
    ? avatar?.[0]
      ? URL.createObjectURL(avatar[0])
      : ''
    : avatar

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: updateUserCall,
    mutationKey: ['update-user-profile'],

    onMutate(newData) {
      const oldCache = uploadCache({ name: newData.name })

      return oldCache
    },
    onError(_, __, oldCache?: GetUserDetailsType) {
      if (oldCache) {
        uploadCache(oldCache)
      }
    },
  })

  const { mutateAsync: uploadAvatar } = useMutation({
    mutationKey: ['upload-avatar-image', userDetails?.id],
    mutationFn: uploadAvatarImage,

    onError(_, __, oldCache?: GetUserDetailsType) {
      if (oldCache) {
        uploadCache(oldCache)
      }
    },

    onMutate() {
      const oldCache = uploadCache({
        avatarImageUrl,
      })

      return oldCache
    },
  })

  async function handleEditProfile({ avatar, name }: EditProfileFormType) {
    const formData = new FormData()

    try {
      if (isFileList(avatar) && dirtyFields.avatar) {
        const compressedImage = await compressImageAsync(avatar[0])

        formData.set('avatar', compressedImage)

        await uploadAvatar(formData)

        toast.success('Imagem do perfil atualizada com sucesso')
      }

      await updateUser({ name })

      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogDescription>
          Atualize a informações do seu perfil
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleEditProfile)}
        className="flex flex-col gap-2"
      >
        <label className="flex cursor-pointer flex-col items-center justify-center">
          <Avatar className="size-[200px]">
            {avatarImageUrl ? (
              <AvatarImage src={avatarImageUrl} />
            ) : (
              <AvatarFallback className="flex justify-center px-2">
                <span className="text-center text-muted-foreground ">
                  Clique para adicionar uma imagem
                </span>
              </AvatarFallback>
            )}
          </Avatar>
          <input
            type="file"
            id="inputFile"
            className="invisible"
            {...register('avatar')}
          />
        </label>

        <div className="space-y-2">
          <Label className="text-right" htmlFor="name">
            Nome
          </Label>
          <Input className="col-span-3" id="name" {...register('name')} />
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Label className="text-right" htmlFor="name">
              Email
            </Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <AlertCircle className="size-4 text-muted-foreground" />
              </HoverCardTrigger>

              <HoverCardContent>
                <p className="text-xs text-muted-foreground">
                  Temporariamente indisponível
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>

          <Input
            disabled
            className="col-span-3"
            id="name"
            {...register('email')}
            type="email"
          />
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
