import type { ColumnDef } from 'components/data-table';
import type { IRecipeListItem } from 'types/recipes.types';
import { formatDate } from 'utils/date';
import { ConfirmStatusBadge } from 'ui/confirmStatusBadge';

function shortName(d?: {
  first_name: string;
  middle_name: string;
  last_name: string;
} | null) {
  if (!d) return '—';
  const fi = d.first_name?.trim().charAt(0);
  const mi = d.middle_name?.trim().charAt(0);
  const initials = [fi, mi].filter(Boolean).map((c) => `${c}.`).join('');
  return `${d.last_name} ${initials}`.trim();
}

export const recipeConfirmColumns: ColumnDef<IRecipeListItem>[] = [
  {
    key: 'recipe_number',
    header: '№ Рецепта',
    width: '150px',
    render: (r) => r.recipe_number,
  },
  {
    key: 'patient',
    header: 'Пациент',
    width: '1fr',
    render: (r) => shortName(r.patient) || '—',
  },
  {
    key: 'created_at',
    header: 'Дата',
    width: '150px',
    className: 'justify-content-center',
    render: (r) => formatDate(r.created_at),
  },
  {
    key: 'doctor',
    header: 'Врач',
    width: '1fr',
    render: (r) => shortName(r.doctor) || '—',
  },
  {
    key: 'doctor_confirm_status',
    header: 'Статус',
    width: '150px',
    className: 'justify-content-center',
    render: (r) => <ConfirmStatusBadge status={r.doctor_confirm_status} />,
  },
];
