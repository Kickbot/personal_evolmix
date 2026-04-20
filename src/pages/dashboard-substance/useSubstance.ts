import { useEffect, useState } from 'react';
import { substance as substanceApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import { upsertById } from 'utils';
import type { ISubstanceListItem, ISubstanceSearchParams } from 'types/substances.types';

const SORT_MAP = {
  name: 'name',
  concentration: 'concentration',
  manufacturer: 'manufacturer',
  country: 'country',
  is_lyophilizate: 'lyophilizate',
} as const;

export function useSubstance() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort: onSort, resetSort,
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

  const handleSort = (field: string) => {
    onSort(field);
    resetPage();
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
    const beField = sortField ? (SORT_MAP as Record<string, string>)[sortField] : undefined;
    const sortParams: Pick<ISubstanceSearchParams, 'order_by' | 'sort_direction'> = {};
    if (beField && sortDirection !== 'none') {
      sortParams.order_by = beField as ISubstanceSearchParams['order_by'];
      sortParams.sort_direction = sortDirection;
    }

    if (debouncedSearchName) {
      substanceApi
        .getSearchSubstance({
          name: debouncedSearchName,
          archived_status: archivedStatus,
          ...sortParams,
          limit: pageSize,
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
          ...sortParams,
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
  }, [archivedStatus, debouncedSearchName, offset, sortField, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  return {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedSubstances: substances,
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
