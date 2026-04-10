import { z } from 'zod'

export const loginSchema = z.object({
  email_address: z
    .string()
    .trim()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(8, 'Минимум 8 символов'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
