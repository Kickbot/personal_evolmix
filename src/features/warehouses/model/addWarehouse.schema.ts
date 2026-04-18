import { z } from 'zod';

export const addWarehouseSchema = z.object({
  active_substance_id: z.string().min(1, 'Выберите действующее вещество'),
  volume: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (v) => !v || !Number.isNaN(Number(v.replace(',', '.'))),
      {
        message: 'Некорректное число',
      },
    ),
  wh_quantity: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (v) => !v || !Number.isNaN(Number(v.replace(',', '.'))),
      {
        message: 'Некорректное число',
      },
    ),
});

export const editWarehouseSchema = addWarehouseSchema;

export type AddWarehouseFormValues = z.infer<typeof addWarehouseSchema>;
export type EditWarehouseFormValues = z.infer<typeof editWarehouseSchema>;
