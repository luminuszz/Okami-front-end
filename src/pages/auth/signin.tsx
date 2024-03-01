import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { createSession } from '@/api/create-session'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formLoginSchema = z.object({
  email: z.string().email('Informe um email válido'),
  password: z
    .string({
      required_error: 'Informe uma senha válida',
      invalid_type_error: "'Informe uma senha válida'",
    })
    .min(8, 'Informe uma senha válida'),
})

type FormLogin = z.infer<typeof formLoginSchema>

export function Signin() {
  const navigate = useNavigate()

  const form = useForm<FormLogin>({
    resolver: zodResolver(formLoginSchema),
    values: {
      email: '',
      password: '',
    },
  })

  const { mutate: makeSession, isPending } = useMutation({
    mutationFn: createSession,

    onSuccess() {
      toast.success('Login feito com sucesso')
      navigate('/', { replace: true })
    },

    onError(err) {
      if (err instanceof AxiosError && err.code === '401') {
        toast.error('Usuário ou senha inválidos!')
      } else {
        toast.error('Opa, algo deu errado! Tente novamente mais tarde.')
      }
    },
  })

  function handleSigin(payload: FormLogin) {
    makeSession(payload)
  }

  return (
    <>
      <Helmet title="Login" />

      <div className="p-8">
        <div className="flex w-[320px] flex-col justify-center gap-6">
          <header className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar Painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas obras favoritas e muito mais
            </p>
          </header>
          <Form {...form}>
            <form
              className="flex flex-col gap-4 "
              onSubmit={form.handleSubmit(handleSigin)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="okami@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isPending || !form.formState.isValid}
                className="w-full"
                type="submit"
              >
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  'Login'
                )}
              </Button>

              <Button disabled={isPending} asChild type="button" variant="link">
                <Link to="/auth/sign-up">Não possui uma conta ? </Link>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
