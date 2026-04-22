import type { ColumnDef } from 'components/data-table';
import type { IPatientListItem } from 'types/patients.types';
import { StatusBadge } from 'ui/statusBadge';
import { formatDate } from 'utils/date';
import { shortName } from 'utils/name';

export const patientColumns: ColumnDef<IPatientListItem>[] = [
  {
    key: 'is_archived',
    header: 'Статус',
    sortable: true,
    width: '114px',
    className: 'justify-content-center',
    render: (u) => (
      <StatusBadge status={u.is_archived ? 'archived' : 'active'} />
    ),
  },
  {
    key: 'last_name',
    header: 'Пациент',
    sortable: true,
    width: '1fr',
    render: (u) => shortName(u),
  },
  {
    key: 'gender',
    header: 'Пол',
    sortable: true,
    width: '92px',
    className: 'justify-content-center',
    render: (u) => (u.gender === 'male' ? 'М' : 'Ж'),
  },
  {
    key: 'identification_number',
    header: 'История Болезни',
    width: '1fr',
    render: (u) => u.identification_number?.trim() ?? '—',
  },
  {
    key: 'date_of_birth',
    header: 'Дата рождения',
    sortable: true,
    width: '220px',
    className: 'justify-content-center',
    render: (u) => formatDate(u.date_of_birth),
  },
];
