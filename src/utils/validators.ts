import { z } from 'zod'

const defaultEmailMessage = 'Informe em e-mail válido'

export const emailValidator = z
  .string({
    required_error: 'Campo obrigatório',
    invalid_type_error: defaultEmailMessage,
  })
  .email(defaultEmailMessage)
