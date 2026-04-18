import type { ColumnDef } from 'components/data-table';
import type { IWarehouseListItem } from 'types/warehouse.types';

export const warehouseColumns: ColumnDef<IWarehouseListItem>[] = [
  {
    key: 'index',
    header: '№',
    sortable: false,
    width: '60px',
    className: 'justify-content-center',
    render: (_w, index) => index + 1,
  },
  {
    key: 'name',
    header: 'Действующее Вещество',
    sortable: true,
    width: '1fr',
    render: (w) => w.active_substance.name,
  },
  {
    key: 'concentration',
    header: 'Концентрация (мг)',
    sortable: true,
    width: '200px',
    className: 'justify-content-center',
    render: (w) => w.active_substance.concentration,
  },
  {
    key: 'wh_quantity',
    header: 'Количество',
    sortable: true,
    width: '200px',
    className: 'justify-content-center',
    render: (w) => w.wh_quantity ?? '-',
  },
  {
    key: 'volume',
    header: 'Тара (мг/мл)',
    sortable: true,
    width: '200px',
    className: 'justify-content-center',
    render: (w) => (w.volume ? (w.pure_mass ?? '') + ' / ' + w.volume : '-'),
  },
];
