import { useCallback, useEffect, useState } from 'react';
import { task as taskApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import type {
  ITaskListItem,
  ITaskSearchBody,
  ITaskSearchQueryParams,
  ITaskStatus,
  ITasksResponse,
} from 'types/tasks.types';

type ArchivedStatus = 'archived' | 'nonarchived';

const SORT_MAP = {
  status: 'status',
  pharmacist_name: 'pharmacist',
  created_at: 'date',
} as const;

export function useTasks() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort: onSort, resetSort,
    searchName, setSearchName,
    isSearchLoading, setIsSearchLoading,
  } = useListControls();
  const [tasks, setTasks] = useState<ITaskListItem[]>([]);
  const [searchResults, setSearchResults] = useState<ITaskListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivedStatus, setArchivedStatus] = useState<ArchivedStatus>('nonarchived');
  const [statusFilter, setStatusFilter] = useState<ITaskStatus | ''>('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handlePageChange = useCallback((page: number) => {
    onPageChange(page);
    setExpandedTaskId(null);
  }, [onPageChange]);

  const handleSort = useCallback((field: string) => {
    onSort(field);
    resetPage();
    setExpandedTaskId(null);
  }, [onSort, resetPage]);

  const handleArchiveToggle = useCallback(() => {
    if (searchName.trim()) setIsSearchLoading(true);
    setExpandedTaskId(null);
    resetPage();
    resetSort();
    setArchivedStatus((current) =>
      current === 'nonarchived' ? 'archived' : 'nonarchived',
    );
  }, [resetPage, resetSort, searchName, setIsSearchLoading]);

  const handleSearchNameChange = useCallback((value: string) => {
    setSearchName(value);
    resetPage();
    if (value.trim()) {
      setIsSearchLoading(true);
    } else {
      setIsSearchLoading(false);
      setSearchResults([]);
    }
  }, [resetPage, setIsSearchLoading, setSearchName]);

  const handleStatusFilterChange = useCallback((value: ITaskStatus | '') => {
    setStatusFilter(value);
    resetPage();
  }, [resetPage]);

  const handleRowClick = useCallback((taskId: string) => {
    setExpandedTaskId((current) => (current === taskId ? null : taskId));
  }, []);

  const handleSearchResultClick = useCallback((t: ITaskListItem) => {
    setExpandedTaskId(t.id);
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;
    const body: ITaskSearchBody = {
      is_archived: archivedStatus === 'archived',
    };
    if (debouncedSearchName) body.barcode = debouncedSearchName;
    if (statusFilter) body.pharmacist_confirm_status = statusFilter;

    const beField = sortField ? (SORT_MAP as Record<string, string>)[sortField] : undefined;
    const query: ITaskSearchQueryParams = { limit: pageSize, offset };
    if (beField && sortDirection !== 'none') {
      query.order_by = beField as ITaskSearchQueryParams['order_by'];
      query.sort_direction = sortDirection;
    }

    (taskApi.postSearchTask(body, query) as Promise<ITasksResponse>)
      .then((data) => {
        if (!isCurrentRequest) return;
        setError(null);
        setTotal(data.total);
        setTasks(data.tasks);
        if (debouncedSearchName) setSearchResults(data.tasks);
      })
      .catch(() => {
        if (!isCurrentRequest) return;
        setTasks([]);
        if (debouncedSearchName) setSearchResults([]);
        setError('Не удалось загрузить задачи');
      })
      .finally(() => {
        if (!isCurrentRequest) return;
        setIsLoading(false);
        setIsSearchLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [archivedStatus, statusFilter, debouncedSearchName, offset, sortField, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  return {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    tasks,
    expandedTaskId,
    sortField,
    sortDirection,
    statusFilter,
    handleStatusFilterChange,
    handleArchiveToggle,
    handleRowClick,
    handleSearchResultClick,
    handleSort,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
