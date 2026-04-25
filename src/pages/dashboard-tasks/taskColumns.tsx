import type { ColumnDef } from 'components/data-table';
import type { ITaskListItem } from 'types/tasks.types';
import { StatusBadge } from 'ui/statusBadge';
import { formatDate } from 'utils/date';
import { shortName } from 'utils/name';

export const taskColumns: ColumnDef<ITaskListItem>[] = [
  {
    key: 'status',
    header: 'Статус',
    sortable: true,
    width: '114px',
    className: 'justify-content-center',
    render: (t) => <StatusBadge status={t.pharmacist_confirm_status} />,
  },
  {
    key: 'pharmacist_name',
    header: 'Фармацевт',
    sortable: true,
    width: '1fr',
    render: (t) => shortName(t.pharmacist),
  },
  {
    key: 'task_number',
    header: '№ Задание',
    width: '1fr',
    render: (t) => t.id.slice(0, 12),
  },
  {
    key: 'created_at',
    header: 'Дата',
    sortable: true,
    width: '120px',
    className: 'justify-content-center',
    render: (t) => formatDate(t.created_at),
  },
];
