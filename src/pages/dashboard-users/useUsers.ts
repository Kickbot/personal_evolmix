import { useEffect, useState } from 'react';
import { user as userApi } from 'api';
import ROLES from 'const/roles';
import { useDebounce } from 'hooks/useDebounce';
import type { IUserListItem, IUserSearchParams } from 'types/users.types';
import type { SortDirection } from 'components/data-table';

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

export function useUsers() {
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(ROLES.ADMIN);
  const [archivedStatus, setArchivedStatus] =
    useState<IUserSearchParams['archived_status']>('nonarchived');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<IUserListItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handleTabChange = (tabKey: string) => {
    if (tabKey === activeTab) return;

    setIsLoading(true);
    setExpandedUserId(null);
    setSortField(undefined);
    setSortDirection('none');
    setActiveTab(tabKey);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) {
      setIsSearchLoading(true);
    }
    setExpandedUserId(null);
    setSortField(undefined);
    setSortDirection('none');
    setArchivedStatus((current) =>
      current === 'nonarchived' ? 'archived' : 'nonarchived',
    );
  };

  const handleSearchNameChange = (value: string) => {
    setSearchName(value);
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

  const handleArchiveUser = (userId: string) => {
    userApi
      .patchUser(userId, { is_archived: true })
      .then((data) => {
        if ((data as { success: boolean }).success) {
          setUsers((current) => current.filter((u) => u.id !== userId));
          setExpandedUserId(null);
        }
      });
  };

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    }
  };

  const handleUserUpdated = (updatedUser?: IUserListItem) => {
    if (!updatedUser) return;
    setUsers((current) =>
      current.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
      ),
    );
    setSearchResults((current) =>
      current.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
      ),
    );
  };

  useEffect(() => {
    if (debouncedSearchName) {
      const params: IUserSearchParams = {
        name: debouncedSearchName,
        status: 'active',
        archived_status: archivedStatus,
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
      };

      userApi
        .search(params)
        .then((data: { users: IUserListItem[] }) => {
          setError(null);
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
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
      };

      userApi
        .search(params)
        .then((data: { users: IUserListItem[] }) => {
          setError(null);
          setUsers(data.users);
        })
        .catch(() => {
          setUsers([]);
          setError('Не удалось загрузить пользователей');
        })
        .finally(() => setIsLoading(false));
    }
  }, [activeTab, archivedStatus, debouncedSearchName]);

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  const displayedUsers =
    !sortField || sortDirection === 'none'
      ? users
      : [...users].sort((a, b) => {
          let result = 0;
          if (sortField === 'name') {
            result = a.last_name.localeCompare(b.last_name, 'ru', {
              sensitivity: 'base',
            });
          } else if (sortField === 'date') {
            result =
              new Date(a.registration_date).getTime() -
              new Date(b.registration_date).getTime();
          }
          return sortDirection === 'asc' ? result : -result;
        });

  return {
    isLoading,
    error,
    activeTab,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedUsers,
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
  };
}
