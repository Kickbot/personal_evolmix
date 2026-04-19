import { useEffect, useState } from 'react';
import { substance as substanceApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import { upsertById } from 'utils';
import type { ISubstanceListItem, ISubstanceSearchParams } from 'types/substances.types';

export function useSubstance() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort, resetSort,
    searchName, setSearchName,
    isSearchLoading, setIsSearchLoading,
  } = useListControls();
  const [substances, setSubstances] = useState<ISubstanceListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivedStatus, setArchivedStatus] =
    useState<ISubstanceSearchParams['archived_status']>('nonarchived');
  const [searchResults, setSearchResults] = useState<ISubstanceListItem[]>([]);
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) {
      setIsSearchLoading(true);
    }
    resetPage();
    resetSort();
    setArchivedStatus((current) =>
      current === 'nonarchived' ? 'archived' : 'nonarchived',
    );
  };

  const handleSearchNameChange = (value: string) => {
    setSearchName(value);
    resetPage();
    if (value.trim()) {
      setIsSearchLoading(true);
    } else {
      setIsSearchLoading(false);
      setSearchResults([]);
    }
  };

  const handleArchiveSubstance = (substanceId: string, isArchived: boolean) => {
    substanceApi
      .patchSubstance(substanceId, { is_archived: !isArchived })
      .then((data) => {
        if ((data as { success: boolean }).success) {
          setSubstances((current) => current.filter((s) => s.id !== substanceId));
        }
      });
  };

  const handleSubstanceUpdated = (updatedSubstance?: ISubstanceListItem) => {
    if (!updatedSubstance) return;
    setSubstances((current) => upsertById(current, updatedSubstance));
    setSearchResults((current) => upsertById(current, updatedSubstance));
  };

  useEffect(() => {
    if (debouncedSearchName) {
      substanceApi
        .getSearchSubstance({
          name: debouncedSearchName,
          archived_status: archivedStatus,
          limit: 1000,
          offset,
        })
        .then((data: { total: number; substances: ISubstanceListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setSearchResults(data.substances);
          setSubstances(data.substances);
        })
        .catch(() => {
          setSubstances([]);
          setSearchResults([]);
          setError('Не удалось загрузить вещества');
        })
        .finally(() => {
          setIsLoading(false);
          setIsSearchLoading(false);
        });
    } else {
      substanceApi
        .getAllSubstance({
          archived_status: archivedStatus,
          limit: pageSize,
          offset,
        })
        .then((data: { total: number; substances: ISubstanceListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setSubstances(data.substances);
        })
        .catch(() => {
          setSubstances([]);
          setError('Не удалось загрузить вещества');
        })
        .finally(() => setIsLoading(false));
    }
  }, [archivedStatus, debouncedSearchName, offset]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  const displayedSubstances =
    !sortField || sortDirection === 'none'
      ? substances
      : [...substances].sort((a, b) => {
          let result = 0;
          if (sortField === 'name') {
            result = a.name.localeCompare(b.name, 'ru', {
              sensitivity: 'base',
            });
          } else if (sortField === 'concentration') {
            result = a.concentration - b.concentration;
          } else if (sortField === 'manufacturer') {
            result = a.manufacturer.localeCompare(b.manufacturer, 'ru', {
              sensitivity: 'base',
            });
          } else if (sortField === 'country') {
            result = a.country.localeCompare(b.country, 'ru', {
              sensitivity: 'base',
            });
          } else if (sortField === 'is_lyophilizate') {
            result = Number(a.is_lyophilizate) - Number(b.is_lyophilizate);
          }
          return sortDirection === 'asc' ? result : -result;
        });

  return {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedSubstances,
    sortField,
    sortDirection,
    handleArchiveToggle,
    handleArchiveSubstance,
    handleSort,
    handleSubstanceUpdated,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
