import { memo, useState } from 'react';
import type { TransitionEvent } from 'react';
import type { ColumnDef } from './types';

interface DataTableRowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  isExpanded: boolean;
  itemId: string;
  onRowClick?: (id: string) => void;
  renderExpanded?: (item: T) => React.ReactNode;
  index: number;
}

function DataTableRowComponent<T>({
  item,
  columns,
  isExpanded,
  itemId,
  onRowClick,
  renderExpanded,
  index,
}: DataTableRowProps<T>) {
  const [shouldRender, setShouldRender] = useState(isExpanded);
  const [prevExpanded, setPrevExpanded] = useState(isExpanded);

  if (isExpanded !== prevExpanded) {
    setPrevExpanded(isExpanded);
    if (isExpanded) setShouldRender(true);
  }

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'max-height') return;
    if (!isExpanded) setShouldRender(false);
  };

  return (
    <div className={`dt-item${isExpanded ? ' is-open' : ''}`}>
      <button
        type="button"
        className="dt-row"
        onClick={() => onRowClick?.(itemId)}
        aria-expanded={isExpanded}
      >
        {columns.map((col) => (
          <div key={col.key} className={`dt-cell${col.className ? ` ${col.className}` : ''}`}>
            {col.render(item, index)}
          </div>
        ))}
      </button>
      {renderExpanded && (
        <div className="dt-details-wrap" onTransitionEnd={handleTransitionEnd}>
          {shouldRender ? renderExpanded(item) : null}
        </div>
      )}
    </div>
  );
}

export const DataTableRow = memo(DataTableRowComponent) as typeof DataTableRowComponent;
