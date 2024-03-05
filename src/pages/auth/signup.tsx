import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerNewUser } from '@/api/register-new-user'
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

const formSchema = z
  .object({
    name: z.string().min(4, 'Informe um nome com mais de 4 caracteres'),
    email: z.string().email('Informe um email válido'),
    password: z.string().min(8, 'Informe uma senha com mais de 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'Informe uma senha com mais de 8 caracteres'),
  })
  .superRefine((context, ctx) => {
    const matchPassword = context.password === context.confirmPassword

    if (!matchPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não são coincidentes',
        path: ['confirmPassword'],
      })
    }
  })

type FormType = z.infer<typeof formSchema>

export function SignUp() {
  const navigate = useNavigate()

  const [canShowPassword, setCanShowPassword] = useState(false)

  const { mutateAsync: registerUserCall } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: registerNewUser,
  })

  const form = useForm<FormType>({
    values: {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  })

  async function handleSigOut(values: FormType) {
    try {
      await registerUserCall(values)
      form.reset()
      toast.success('Usuário registrado com sucesso')

      navigate('/')
    } catch (exception) {
      if (exception instanceof Error) {
        if (exception.message === 'User already exists') {
          toast.error('Usuário já existe')
        } else {
          toast.error('Erro ao registrar usuário')
        }
      }
    }
  }

  function handleTogglePasswordShow() {
    setCanShowPassword((prev) => !prev)
  }

  const inputPasswordType = canShowPassword ? 'text' : 'password'

  return (
    <>
      <Helmet title="Register" />
      <div className="p-8">
        <div className="flex w-[320px] flex-col justify-center gap-6">
          <header className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Cadastro</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre-se para acompanhar suas obras favoritas e muito mais...
            </p>
          </header>

          <Form {...form}>
            <form
              className="flex flex-col gap-4 "
              onSubmit={form.handleSubmit(handleSigOut)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Jhon Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="okami@email.com"
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
                  <FormItem className="relative">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type={inputPasswordType}
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>

                    {canShowPassword ? (
                      <EyeOff
                        onClick={handleTogglePasswordShow}
                        className="absolute right-2 top-8"
                      />
                    ) : (
                      <Eye
                        onClick={handleTogglePasswordShow}
                        className="absolute right-2 top-8"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input
                        type={inputPasswordType}
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                className="w-full"
                type="submit"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  'Registrar'
                )}
              </Button>

              <Button asChild type="button" variant="link">
                <Link to="/auth/sign-in">Já possui uma conta ?</Link>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
