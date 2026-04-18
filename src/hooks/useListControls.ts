import { useState } from 'react';
import type { SortDirection } from 'components/data-table';

export function useListControls() {
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [searchName, setSearchName] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    }
  };

  const resetSort = () => {
    setSortField(undefined);
    setSortDirection('none');
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort,
    searchName,
    setSearchName,
    isSearchLoading,
    setIsSearchLoading,
  };
}
