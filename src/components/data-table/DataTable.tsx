import { cn } from 'utils';
import { DataTableHeader } from './DataTableHeader';
import { DataTableRow } from './DataTableRow';
import type { ColumnDef, SortDirection } from './types';
import './data-table.css';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  expandedId?: string | null;
  onRowClick?: (id: string) => void;
  renderExpanded?: (item: T) => React.ReactNode;
  sortField?: string;
  sortDirection?: SortDirection;
  onSort?: (field: string) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  expandedId,
  onRowClick,
  renderExpanded,
  sortField,
  sortDirection,
  onSort,
  emptyMessage = 'Нет данных',
  className,
}: DataTableProps<T>) {
  const gridTemplate = columns.map((c) => c.width ?? '1fr').join(' ');
  const gridStyle = { '--dt-columns': gridTemplate } as React.CSSProperties;

  return (
    <div className={cn('dt', className)} style={gridStyle}>
      <DataTableHeader
        columns={columns}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <div className="dt-body">
        {data.length > 0 ? (
          data.map((item) => {
            const id = keyExtractor(item);
            return (
              <DataTableRow
                key={id}
                item={item}
                columns={columns}
                isExpanded={expandedId === id}
                onToggle={() => onRowClick?.(id)}
                renderExpanded={renderExpanded}
              />
            );
          })
        ) : (
          <div className="dt-empty text-center text-muted">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
