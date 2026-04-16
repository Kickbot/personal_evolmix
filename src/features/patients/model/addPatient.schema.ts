import { z } from 'zod'

export const addPatientSchema = z.object({
  first_name: z.string().trim().min(1, 'Имя обязательно'),
  last_name: z.string().trim().min(1, 'Фамилия обязательна'),
  middle_name: z
    .string()
    .trim()
    .min(1, 'Отчество обязательно')
    .min(2, 'Минимум 2 символа'),
  doctor: z.string().trim().optional(),
  department: z.string().trim().optional(),
  identification_number: z.string().trim().optional(),
  room_number: z.string().trim().optional(),
  date_of_birth: z.string().optional(),
  gender: z
    .string()
    .optional()
    .refine((v) => !v || v === 'male' || v === 'female', {
      message: 'Выберите пол',
    }),
  weight: z
    .string()
    .trim()
    .min(1, 'Вес обязателен')
    .refine((v) => !Number.isNaN(Number(v.replace(',', '.'))), {
      message: 'Некорректное число',
    }),
  height: z
    .string()
    .trim()
    .min(1, 'Рост обязателен')
    .refine((v) => !Number.isNaN(Number(v.replace(',', '.'))), {
      message: 'Некорректное число',
    }),
})

export const editPatientSchema = addPatientSchema

export type AddPatientFormValues = z.infer<typeof addPatientSchema>
export type EditPatientFormValues = z.infer<typeof editPatientSchema>
