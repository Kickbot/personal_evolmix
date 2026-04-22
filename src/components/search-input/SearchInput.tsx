import { useEffect, useRef, useState } from 'react';
import { Input } from 'ui/input';
import './search-input.css';

interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  hasResults?: boolean;
  placeholder?: string;
  loadingMessage?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function SearchInput({
  id,
  value,
  onChange,
  isLoading,
  hasResults,
  placeholder = 'Поиск',
  loadingMessage = 'Идет поиск...',
  emptyMessage = 'Нет результатов',
  children,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasValue = value.trim().length > 0;

  return (
    <div ref={anchorRef} className="search-input-anchor">
      <div className="search-input-box">
        <Input
          className="search-input-field"
          id={id}
          type="text"
          value={value}
          wrapperClassName="search-input-wrapper"
          autoComplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {hasValue ? (
          <button
            type="button"
            className="search-input-action"
            aria-label="Очистить поиск"
            onClick={() => onChange('')}
          >
            +
          </button>
        ) : (
          <span
            className="search-input-action search-input-action--icon"
            aria-hidden="true"
          />
        )}
      </div>
      {isFocused && (
        <div className="search-input-dropdown">
          {isLoading ? (
            <div className="search-input-dropdown__state">
              {loadingMessage}
            </div>
          ) : children && hasResults !== false ? (
            <div onClick={() => setIsFocused(false)}>{children}</div>
          ) : (
            <div className="search-input-dropdown__state">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
