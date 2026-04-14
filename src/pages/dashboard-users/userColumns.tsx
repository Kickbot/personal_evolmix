import type { IUserListItem } from 'types/users.types';
import type { ColumnDef } from 'components/data-table';
import { formatDate } from 'utils/date';

export const userColumns: ColumnDef<IUserListItem>[] = [
  {
    key: 'name',
    header: 'ФИО',
    sortable: true,
    width: '1.2fr',
    render: (u) => `${u.last_name} ${u.first_name} ${u.middle_name}`,
  },
  {
    key: 'department',
    header: 'Отделение',
    width: '1.4fr',
    render: (u) => u.department ?? '—',
  },
  {
    key: 'date',
    header: 'Дата',
    sortable: true,
    width: '120px',
    className: 'dt-cell--date',
    render: (u) => formatDate(u.registration_date),
  },
];
