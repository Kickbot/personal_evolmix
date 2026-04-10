import { IconButton } from 'ui/button';
import { SortIcon } from 'ui/icons';
import type { ColumnDef, SortDirection } from './types';

interface DataTableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sortField?: string;
  sortDirection?: SortDirection;
  onSort?: (field: string) => void;
}

export function DataTableHeader<T>({
  columns,
  sortField,
  sortDirection = 'none',
  onSort,
}: DataTableHeaderProps<T>) {
  return (
    <div className="dt-header">
      {columns.map((col) => (
        <div key={col.key} className={`dt-cell${col.className ? ` ${col.className}` : ''}`}>
          {col.header}
          {col.sortable && onSort && (
            <IconButton
              onClick={() => onSort(col.key)}
              aria-label={`Сортировать по ${col.header}`}
              className={sortField === col.key && sortDirection !== 'none' ? 'is-active' : undefined}
            >
              <SortIcon />
            </IconButton>
          )}
        </div>
      ))}
    </div>
  );
}
