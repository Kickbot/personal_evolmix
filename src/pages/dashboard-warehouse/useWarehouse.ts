import { useEffect, useState } from 'react';
import { warehouse as warehouseApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import { upsertById } from 'utils';
import type { IWarehouseListItem, IWarehouseSearchParams } from 'types/warehouse.types';

export function useWarehouse() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort, resetSort,
    searchName, setSearchName,
    isSearchLoading, setIsSearchLoading,
  } = useListControls();
  const [warehouse, setWarehouse] = useState<IWarehouseListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivedStatus, setArchivedStatus] =
    useState<IWarehouseSearchParams['archived_status']>('nonarchived');
  const [searchResults, setSearchResults] = useState<IWarehouseListItem[]>([]);
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

  const handleWarehouseUpdated = (updatedWarehouse?: IWarehouseListItem) => {
    if (!updatedWarehouse) return;
    setWarehouse((current) => upsertById(current, updatedWarehouse));
    setSearchResults((current) => upsertById(current, updatedWarehouse));
  };

  const handleArchiveWarehouse = (warehouseId: string, isArchived: boolean) => {
    warehouseApi
      .patchWarehouse(warehouseId, { is_archived: !isArchived })
      .then((data) => {
        if ((data as { success: boolean }).success) {
          setWarehouse((current) => current.filter((w) => w.id !== warehouseId));
        }
      });
  };

  useEffect(() => {
    if (debouncedSearchName) {
      warehouseApi
        .getSearchWarehouse({
          name: debouncedSearchName,
          archived_status: archivedStatus,
          limit: pageSize,
          offset,
        })
        .then((data: { total: number; substance_packs: IWarehouseListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setSearchResults(data.substance_packs);
          setWarehouse(data.substance_packs);
        })
        .catch(() => {
          setWarehouse([]);
          setSearchResults([]);
          setError('Не удалось загрузить данные склада');
        })
        .finally(() => {
          setIsLoading(false);
          setIsSearchLoading(false);
        });
    } else {
      warehouseApi
        .getAllWarehouse({
          archived_status: archivedStatus,
          limit: pageSize,
          offset,
        })
        .then((data: { total: number; substance_packs: IWarehouseListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setWarehouse(data.substance_packs);
        })
        .catch(() => {
          setWarehouse([]);
          setError('Не удалось загрузить данные склада');
        })
        .finally(() => setIsLoading(false));
    }
  }, [archivedStatus, debouncedSearchName, offset]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  const displayedWarehouse =
    !sortField || sortDirection === 'none'
      ? warehouse
      : [...warehouse].sort((a, b) => {
          let result = 0;
          if (sortField === 'name') {
            result = a.active_substance.name.localeCompare(b.active_substance.name, 'ru', {
              sensitivity: 'base',
            });
          } else if (sortField === 'concentration') {
            result = a.active_substance.concentration - b.active_substance.concentration;
          } else if (sortField === 'wh_quantity') {
            result = (a.wh_quantity ?? 0) - (b.wh_quantity ?? 0);
          } else if (sortField === 'volume') {
            result = (a.volume ?? 0) - (b.volume ?? 0);
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
    displayedWarehouse,
    sortField,
    sortDirection,
    handleArchiveToggle,
    handleArchiveWarehouse,
    handleSort,
    handleWarehouseUpdated,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
