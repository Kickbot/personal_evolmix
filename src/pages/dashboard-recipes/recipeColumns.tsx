import type { ColumnDef } from 'components/data-table';
import type { IRecipeListItem } from 'types/recipes.types';
import type { IPatientListItem } from 'types/patients.types';
import { StatusBadge } from 'ui/statusBadge';
import { ConfirmStatusBadge } from 'ui/confirmStatusBadge';
import { formatDate } from 'utils/date';

function patientShortName(p: IPatientListItem): string {
  const fi = p.first_name?.trim().charAt(0);
  const mi = p.middle_name?.trim().charAt(0);
  const initials = [fi, mi].filter(Boolean).map((c) => `${c}.`).join('');
  return `${p.last_name} ${initials}`.trim();
}

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
    render: (r) => patientShortName(r.patient),
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
