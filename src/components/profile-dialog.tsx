import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getUserDetails, GetUserDetailsType } from '@/api/get-user-details'
import { uploadAvatarImage } from '@/api/upload-avatar-image'
import { compressImageAsync } from '@/lib/imageCompressor'
import { isFileList } from '@/lib/utils'

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

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting },
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

  const { mutateAsync: uploadAvatar } = useMutation({
    mutationKey: ['upload-avatar-image', userDetails?.id],
    mutationFn: uploadAvatarImage,
    onError(_, __, context?: GetUserDetailsType) {
      if (context) {
        queryClient.setQueryData<GetUserDetailsType>(['user-details'], context)
      }
    },

    onMutate() {
      const cached = queryClient.getQueryData<GetUserDetailsType>([
        'user-details',
      ])

      if (cached) {
        queryClient.setQueryData<GetUserDetailsType>(['user-details'], {
          ...cached,
          avatarImageUrl: avatarImageUrl ?? '',
          email: userDetails?.email ?? '',
          name: userDetails?.name ?? '',
        })
      }

      return cached
    },
  })

  async function handleEditProfile({
    avatar,
    name,
    email,
  }: EditProfileFormType) {
    const formData = new FormData()

    try {
      if (isFileList(avatar)) {
        const compressedImage = await compressImageAsync(avatar[0])

        formData.set('avatar', compressedImage)
        formData.set('name', name)
        formData.set('email', email ?? '')

        await uploadAvatar(formData)

        toast.success('Perfil atualizado com sucesso')
      }
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
              <AvatarFallback>Algo aqui</AvatarFallback>
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
          <Input
            disabled
            className="col-span-3"
            id="name"
            {...register('name')}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-right" htmlFor="name">
            Email
          </Label>
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
