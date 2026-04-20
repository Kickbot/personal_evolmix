import { useEffect, useState } from 'react';
import { warehouse as warehouseApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import { upsertById } from 'utils';
import type { IWarehouseListItem, IWarehouseSearchParams } from 'types/warehouse.types';

const SORT_MAP = {
  name: 'name',
  concentration: 'concentration',
  wh_quantity: 'quantity',
  volume: 'volume',
} as const;

export function useWarehouse() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort: onSort, resetSort,
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

  const handleWarehouseUpdated = (updatedWarehouse?: IWarehouseListItem) => {
    if (!updatedWarehouse) return;
    setWarehouse((current) => upsertById(current, updatedWarehouse));
    setSearchResults((current) => upsertById(current, updatedWarehouse));
  };

  const handleArchiveWarehouse = (warehouseId: string, isArchived: boolean) => {
    warehouseApi
      .patchWarehouse(warehouseId, { is_archived: !isArchived })
      .then(() => {
        setWarehouse((current) => current.filter((w) => w.id !== warehouseId));
      });
  };

  useEffect(() => {
    const beField = sortField ? (SORT_MAP as Record<string, string>)[sortField] : undefined;
    const sortParams: Pick<IWarehouseSearchParams, 'order_by' | 'sort_direction'> = {};
    if (beField && sortDirection !== 'none') {
      sortParams.order_by = beField as IWarehouseSearchParams['order_by'];
      sortParams.sort_direction = sortDirection;
    }

    if (debouncedSearchName) {
      warehouseApi
        .getSearchWarehouse({
          name: debouncedSearchName,
          archived_status: archivedStatus,
          ...sortParams,
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
          ...sortParams,
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
    displayedWarehouse: warehouse,
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
