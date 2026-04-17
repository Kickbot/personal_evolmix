import type { ColumnDef } from './types';

interface DataTableRowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  isExpanded: boolean;
  onToggle: () => void;
  renderExpanded?: (item: T) => React.ReactNode;
  index: number;
}

export function DataTableRow<T>({
  item,
  columns,
  isExpanded,
  onToggle,
  renderExpanded,
  index,
}: DataTableRowProps<T>) {
  return (
    <div className={`dt-item${isExpanded ? ' is-open' : ''}`}>
      <button
        type="button"
        className="dt-row"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {columns.map((col) => (
          <div key={col.key} className={`dt-cell${col.className ? ` ${col.className}` : ''}`}>
            {col.render(item, index)}
          </div>
        ))}
      </button>
      {renderExpanded && (
        <div className="dt-details-wrap">
          {isExpanded ? renderExpanded(item) : null}
        </div>
      )}
    </div>
  );
}
