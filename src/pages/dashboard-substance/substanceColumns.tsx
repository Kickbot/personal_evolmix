import type { ColumnDef } from 'components/data-table';
import type { ISubstanceListItem } from 'types/substances.types';

export const substanceColumns: ColumnDef<ISubstanceListItem>[] = [
  {
    key: 'index',
    header: '№',
    sortable: false,
    width: '60px',
    className: 'justify-content-center',
    render: (_s, index) => index + 1,
  },
  {
    key: 'name',
    header: 'Действующее Вещество',
    sortable: true,
    width: '1fr',
    render: (s) => s.name,
  },
  {
    key: 'concentration',
    header: 'Концентрация (мг)',
    sortable: true,
    width: '180px',
    className: 'justify-content-center',
    render: (s) => s.concentration,
  },
  {
    key: 'manufacturer',
    header: 'Производитель',
    sortable: true,
    width: '1fr',
    render: (s) => s.manufacturer,
  },
  {
    key: 'country',
    header: 'Страна',
    sortable: true,
    width: '300px',
    render: (s) => s.country,
  },
  {
    key: 'is_lyophilizate',
    header: 'Лиофилизат',
    sortable: true,
    width: '140px',
    className: 'justify-content-center',
    render: (s) => (s.is_lyophilizate ? 'Да' : 'Нет'),
  },
];
