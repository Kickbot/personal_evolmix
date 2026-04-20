import { useEffect, useState } from 'react';
import { user as userApi } from 'api';
import ROLES from 'const/roles';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import { upsertById } from 'utils';
import type { IUserListItem, IUserSearchParams } from 'types/users.types';

const SORT_MAP_ALL = { name: 'full_name', date: 'date' } as const;
const SORT_MAP_SEARCH = { name: 'full_name' } as const;

export function useUsers() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort: onSort, resetSort,
    searchName, setSearchName,
    isSearchLoading, setIsSearchLoading,
  } = useListControls();
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(ROLES.ADMIN);
  const [archivedStatus, setArchivedStatus] =
    useState<IUserSearchParams['archived_status']>('nonarchived');
  const [searchResults, setSearchResults] = useState<IUserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setExpandedUserId(null);
  };

  const handleSort = (field: string) => {
    onSort(field);
    resetPage();
  };

  const handleTabChange = (tabKey: string) => {
    if (tabKey === activeTab) return;

    setIsLoading(true);
    setExpandedUserId(null);
    resetPage();
    resetSort();
    setActiveTab(tabKey);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) {
      setIsSearchLoading(true);
    }
    setExpandedUserId(null);
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

  const handleRowClick = (userId: string) => {
    setExpandedUserId((current) => (current === userId ? null : userId));
  };

  const handleSearchResultClick = (user: IUserListItem) => {
    setExpandedUserId(user.id);

    if (user.role !== activeTab) {
      setIsLoading(true);
      setActiveTab(user.role);
    }
  };

  const handleArchiveUser = (userId: string, isArchived: boolean) => {
    userApi
      .patchUser(userId, { is_archived: !isArchived })
      .then((data) => {
        if ((data as { success: boolean }).success) {
          setUsers((current) => current.filter((u) => u.id !== userId));
          setExpandedUserId(null);
        }
      });
  };

  const handleUserUpdated = (updatedUser?: IUserListItem) => {
    if (!updatedUser) return;
    setUsers((current) => upsertById(current, updatedUser));
    setSearchResults((current) => upsertById(current, updatedUser));
  };

  useEffect(() => {
    const sortMap = debouncedSearchName ? SORT_MAP_SEARCH : SORT_MAP_ALL;
    const beField = sortField ? (sortMap as Record<string, string>)[sortField] : undefined;
    const sortParams: Pick<IUserSearchParams, 'order_by' | 'sort_direction'> = {};
    if (beField && sortDirection !== 'none') {
      sortParams.order_by = beField as IUserSearchParams['order_by'];
      sortParams.sort_direction = sortDirection;
    }

    if (debouncedSearchName) {
      const params: IUserSearchParams = {
        name: debouncedSearchName,
        status: 'active',
        archived_status: archivedStatus,
        ...sortParams,
        limit: pageSize,
        offset,
      };

      userApi
        .search(params)
        .then((data: { total: number; users: IUserListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setSearchResults(data.users);
          setUsers(data.users.filter((u) => u.role === activeTab));
        })
        .catch(() => {
          setUsers([]);
          setSearchResults([]);
          setError('Не удалось загрузить пользователей');
        })
        .finally(() => {
          setIsLoading(false);
          setIsSearchLoading(false);
        });
    } else {
      const params: IUserSearchParams = {
        role: activeTab,
        status: 'active',
        archived_status: archivedStatus,
        ...sortParams,
        limit: pageSize,
        offset,
      };

      userApi
        .search(params)
        .then((data: { total: number; users: IUserListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setUsers(data.users);
        })
        .catch(() => {
          setUsers([]);
          setError('Не удалось загрузить пользователей');
        })
        .finally(() => setIsLoading(false));
    }
  }, [activeTab, archivedStatus, debouncedSearchName, offset, sortField, sortDirection]);// eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  return {
    isLoading,
    error,
    activeTab,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedUsers: users,
    expandedUserId,
    sortField,
    sortDirection,
    handleTabChange,
    handleArchiveToggle,
    handleArchiveUser,
    handleRowClick,
    handleSearchResultClick,
    handleSort,
    handleUserUpdated,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
