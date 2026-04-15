import { z } from 'zod'

export const addUserSchema = z.object({
  first_name: z.string().trim().min(1, 'Имя обязательно'),
  last_name: z.string().trim().min(1, 'Фамилия обязательна'),
  middle_name: z
    .string()
    .trim()
    .min(1, 'Отчество обязательно')
    .min(2, 'Минимум 2 символа'),
  role: z.string().trim().min(1, 'Выберите должность'),
  email_address: z
    .string()
    .trim()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(8, 'Минимум 8 символов'),
  registration_date: z.string().optional(),
  department: z.string().trim().optional(),
})

export const editUserSchema = addUserSchema.extend({
  password: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || value.length >= 8, {
      message: 'Минимум 8 символов',
    }),
})

export type AddUserFormValues = z.infer<typeof addUserSchema>
export type EditUserFormValues = z.infer<typeof editUserSchema>
