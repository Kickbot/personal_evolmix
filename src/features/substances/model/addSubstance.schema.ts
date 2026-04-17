import { z } from 'zod'

export const addSubstanceSchema = z.object({
  name: z.string().trim().min(1, 'Действующее вещество обязательно'),
  manufacturer: z.string().trim().min(1, 'Производитель обязателен'),
  country: z.string().trim().min(1, 'Страна обязательна'),
  is_lyophilizate: z.string().trim().min(1, 'Выберите значение'),
  concentration: z
    .string()
    .trim()
    .min(1, 'Концентрация обязательна')
    .refine((v) => !Number.isNaN(Number(v.replace(',', '.'))), {
      message: 'Некорректное число',
    }),
  density: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || !Number.isNaN(Number(v.replace(',', '.'))),
      {
        message: 'Некорректное число',
      },
    ),
})

export const editSubstanceSchema = addSubstanceSchema

export type AddSubstanceFormValues = z.infer<typeof addSubstanceSchema>
export type EditSubstanceFormValues = z.infer<typeof editSubstanceSchema>
