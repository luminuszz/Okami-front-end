import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { resetPassword } from '@/api/reset-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z
  .object({
    newPassword: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmNewPassword: z.string(),
  })
  .superRefine((data, context) => {
    if (data.newPassword !== data.confirmNewPassword) {
      context.addIssue({
        code: 'custom',
        message: 'As senhas não coincidem',
        path: ['confirmNewPassword'],
      })
    }
  })

type FormSchema = z.infer<typeof formSchema>

export function ResetPassword() {
  const { codeToken } = useParams<{ codeToken: string }>()
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,

    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync: resetPasswordMutation } = useMutation({
    mutationKey: ['reset-password', codeToken],
    mutationFn: resetPassword,
  })

  async function handleSendResetPasswordEmail({ newPassword }: FormSchema) {
    try {
      if (!codeToken) {
        toast.error('Token de recuperação inválido')
        return
      }

      await resetPasswordMutation({
        newPassword,
        code: codeToken,
      })

      toast.success('Senha alterada com sucesso', {
        description: 'Faça login com a nova senha',
      })

      navigate('/auth/sign-in')
    } catch (e) {
      toast.error('Erro ao recuperar a senha')
    }
  }

  return (
    <>
      <Helmet title="Recuperar acesso, nova senha" />

      <div className="p-8">
        <div className="flex w-[320px] flex-col justify-center gap-6">
          <header className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Nova Senha
            </h1>
            <p className="text-sm text-muted-foreground">
              Informe uma nova senha para recuperar o acesso
            </p>
          </header>

          <form
            className="flex flex-col gap-4 "
            onSubmit={handleSubmit(handleSendResetPasswordEmail)}
          >
            <Label htmlFor="confirmPassword">Senha</Label>
            <Input
              type="password"
              id="confirmPassword"
              {...register('newPassword')}
            />
            <p className="text-sm text-destructive">
              {errors.newPassword?.message}
            </p>

            <Label htmlFor="confirmNewPassword">Confirmar Senha</Label>
            <Input
              type="password"
              id="confirmNewPassword"
              {...register('confirmNewPassword')}
            />
            <p className="text-sm text-destructive">
              {errors.confirmNewPassword?.message}
            </p>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                'Salvar nova senha'
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
