import { z } from 'zod'

export const registerSchema = z
  .object({
    role: z.string().trim().min(1, 'Выберите должность'),
    first_name: z.string().trim().min(1, 'Имя обязательно'),
    last_name: z.string().trim().min(1, 'Фамилия обязательна'),
    middle_name: z
      .string()
      .trim()
      .min(1, 'Отчество обязательно')
      .min(2, 'Минимум 2 символа'),
    email_address: z
      .string()
      .trim()
      .min(1, 'Email обязателен')
      .email('Некорректный email'),
    password: z
      .string()
      .min(1, 'Пароль обязателен')
      .min(8, 'Минимум 8 символов'),
    confirm_password: z
      .string()
      .min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Пароли не совпадают',
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
