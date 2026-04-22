import { z } from 'zod';

const positiveNumber = z
  .string()
  .trim()
  .min(1, 'Обязательное поле')
  .refine(
    (v) => {
      const n = Number(v.replace(',', '.'));
      return !Number.isNaN(n) && n > 0;
    },
    { message: 'Число больше 0' },
  );

export const addRecipeSchema = z.object({
  patient_id: z.string().min(1, 'Выберите пациента'),
  patient_query: z.string().optional(),
  doctor_id: z.string().min(1, 'Выберите врача'),
  doctor_query: z.string().optional(),
  active_substance_id: z.string().min(1, 'Выберите действующее вещество'),
  solvent_id: z.string().min(1, 'Выберите растворитель'),
  active_substance_dosage: positiveNumber,
  solvent_dosage: positiveNumber,
});

export type AddRecipeFormValues = z.infer<typeof addRecipeSchema>;
