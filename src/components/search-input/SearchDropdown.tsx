import type { ReactNode } from 'react';

interface SearchDropdownProps<T> {
  items: T[];
  getKey: (item: T) => string;
  onSelect?: (item: T) => void;
  renderItem: (item: T) => ReactNode;
}

export function SearchDropdown<T>({
  items,
  getKey,
  onSelect,
  renderItem,
}: SearchDropdownProps<T>) {
  if (items.length === 0) return null;

  return (
    <>
      {items.map((item) => (
        <button
          key={getKey(item)}
          type="button"
          className="search-dropdown__item"
          onClick={onSelect ? () => onSelect(item) : undefined}
        >
          {renderItem(item)}
        </button>
      ))}
    </>
  );
}
