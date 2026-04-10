import { useEffect, useRef, useState } from 'react';
import { user as userApi } from 'api';
import ROLES from 'const/roles';
import { useDebounce } from 'hooks/useDebounce';
import type { IUserListItem, IUserSearchParams } from 'types/users.types';
import type { SortDirection } from 'components/data-table';

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

export function useUsers() {
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>(ROLES.ADMIN);
  const [archivedStatus, setArchivedStatus] =
    useState<IUserSearchParams['archived_status']>('nonarchived');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<IUserListItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const searchRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handleTabChange = (tabKey: string) => {
    if (tabKey === activeTab) return;

    setIsLoading(true);
    setExpandedUserId(null);
    setActiveTab(tabKey);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) {
      setIsSearchLoading(true);
    }
    setExpandedUserId(null);
    setArchivedStatus((current) =>
      current === 'nonarchived' ? 'archived' : 'nonarchived',
    );
  };

  const handleRowClick = (userId: string) => {
    setExpandedUserId((current) => (current === userId ? null : userId));
  };

  const handleSearchResultClick = (user: IUserListItem) => {
    setIsSearchFocused(false);
    setExpandedUserId(user.id);

    if (user.role !== activeTab) {
      setIsLoading(true);
      setActiveTab(user.role);
    }
  };

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    }
  };

  useEffect(() => {
    const params: IUserSearchParams = {
      role: activeTab,
      status: 'active',
      archived_status: archivedStatus,
      limit: DEFAULT_LIMIT,
      offset: DEFAULT_OFFSET,
      ...(debouncedSearchName ? { name: debouncedSearchName } : {}),
    };

    userApi
      .search(params)
      .then((data: { users: IUserListItem[] }) => {
        setUsers(data.users);
      })
      .finally(() => setIsLoading(false));
  }, [activeTab, archivedStatus, debouncedSearchName]);

  useEffect(() => {
    if (!debouncedSearchName) {
      return;
    }

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
        setSearchResults(data.users);
      })
      .catch(() => {
        setSearchResults([]);
      })
      .finally(() => setIsSearchLoading(false));
  }, [archivedStatus, debouncedSearchName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showSearchDropdown = isSearchFocused;
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
    activeTab,
    archivedStatus,
    searchName,
    setSearchName,
    isSearchLoading,
    isSearchFocused,
    setIsSearchFocused,
    searchRef,
    showSearchDropdown,
    visibleSearchResults,
    displayedUsers,
    expandedUserId,
    sortField,
    sortDirection,
    handleTabChange,
    handleArchiveToggle,
    handleRowClick,
    handleSearchResultClick,
    handleSort,
  };
}
