import type { ColumnDef } from 'components/data-table';
import type { IRecipeListItem } from 'types/recipes.types';
import { StatusBadge } from 'ui/statusBadge';
import { ConfirmStatusBadge } from 'ui/confirmStatusBadge';
import { formatDate } from 'utils/date';
import { shortName } from 'utils/name';

export const recipeColumns: ColumnDef<IRecipeListItem>[] = [
  {
    key: 'status',
    header: 'Статус',
    sortable: true,
    width: '114px',
    className: 'justify-content-center',
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: 'patient_name',
    header: 'Пациент',
    sortable: true,
    width: '1fr',
    render: (r) => shortName(r.patient),
  },
  {
    key: 'gender',
    header: 'Пол',
    sortable: true,
    width: '92px',
    className: 'justify-content-center',
    render: (r) => (r.patient.gender === 'male' ? 'М' : 'Ж'),
  },
  {
    key: 'recipe_number',
    header: '№ Рецепта',
    width: '1fr',
    render: (r) => r.recipe_number,
  },
  {
    key: 'created_at',
    header: 'Дата',
    sortable: true,
    width: '220px',
    className: 'justify-content-center',
    render: (r) => formatDate(r.created_at),
  },
  {
    key: 'doctor_confirm_status',
    header: 'Глав. Врач',
    sortable: true,
    width: '180px',
    className: 'justify-content-center',
    render: (r) => <ConfirmStatusBadge status={r.doctor_confirm_status} />,
  },
];
