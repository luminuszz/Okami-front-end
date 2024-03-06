import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { sendResetPasswordEmail } from '@/api/send-reset-password-email'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  email: z.string().email('Informe um email válido'),
})

type FormSchema = z.infer<typeof formSchema>

export function SendResetPasswordEmail() {
  const {
    handleSubmit,
    register,

    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync: sendEmail } = useMutation({
    mutationKey: ['send-reset-password-email'],
    mutationFn: sendResetPasswordEmail,
  })

  async function handleSendResetPasswordEmail({ email }: FormSchema) {
    try {
      await sendEmail(email)
      toast.info(
        'Se o e-mail informado estiver cadastrado, você receberá um e-mail com as instruções para recuperar o acesso',
      )
    } catch (err) {
      toast.error(
        'Ocorreu um erro ao enviar o e-mail, tente novamente mais tarde',
      )
    }
  }

  return (
    <>
      <Helmet title="Recuperar acesso" />

      <div className="p-8">
        <div className="flex w-[320px] flex-col justify-center gap-6">
          <header className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Recuperar acesso
            </h1>
            <p className="text-sm text-muted-foreground">
              Se você esqueceu sua senha, informe seu e-mail para recuperar o
              acesso
            </p>
          </header>

          <form
            className="flex flex-col gap-4 "
            onSubmit={handleSubmit(handleSendResetPasswordEmail)}
          >
            <Label htmlFor="email">E-mail</Label>
            <Input type="email" id="email" {...register('email')} />
            <p className="text-sm text-destructive">{errors.email?.message}</p>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                'Recuperar acesso'
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
