import { useEffect, useRef, useState } from 'react';
import { user as userApi } from 'api';
import ROLES, { ROLE_NAMES } from 'const/roles';
import { useDebounce } from 'hooks/useDebounce';
import type { IUserListItem, IUserSearchParams } from 'types/users.types';
import { Button } from 'ui/button';
import { ArchiveIcon } from 'ui/icons';
import { Input } from 'ui/input';
import Loader from 'ui/loader';
import addPlusIcon from 'assets/icons/addPlusIcon.svg';
import { formatDate, formatDateTime } from 'utils/date';
import { DataTable } from 'components/data-table';
import type { ColumnDef, SortDirection } from 'components/data-table';
import { Pagination } from 'components/pagination';
import { AddUserModal } from './AddUserModal';
import './users.css';

const TABS = [
  { key: ROLES.ADMIN, id: 'admins-pane' },
  { key: ROLES.DOCTOR, id: 'doctors-pane' },
  { key: ROLES.PHARMACIST, id: 'pharmacists-pane' },
  { key: ROLES.OPERATOR, id: 'operators-pane' },
];

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

const columns: ColumnDef<IUserListItem>[] = [
  {
    key: 'name',
    header: 'ФИО',
    sortable: true,
    width: '1.2fr',
    render: (u) => `${u.last_name} ${u.first_name} ${u.middle_name}`,
  },
  {
    key: 'email',
    header: 'Email',
    width: '1.4fr',
    render: (u) => u.email_address,
  },
  {
    key: 'date',
    header: 'Дата',
    sortable: true,
    width: '120px',
    className: 'dt-cell--date',
    render: (u) => formatDate(u.registration_date),
  },
];

function UserDetails({ user }: { user: IUserListItem }) {
  return (
    <div className="dt-details p-3">
      <div className="row">
        <div className="col-md-6">
          <div className="dt-details-data p-3">
            <p>
              <strong>Фамилия:</strong> {user.last_name}
            </p>
            <p>
              <strong>Имя:</strong> {user.first_name}
            </p>
            <p>
              <strong>Отчество:</strong> {user.middle_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email_address}
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dt-details-data p-3">
            <p>
              <strong>Роль:</strong> {ROLE_NAMES[user.role] ?? user.role}
            </p>
            <p>
              <strong>Статус:</strong> {user.status}
            </p>
            <p>
              <strong>Дата регистрации:</strong>{' '}
              {formatDateTime(user.registration_date)}
            </p>
            <p>
              <strong>Последний вход:</strong>{' '}
              {formatDateTime(user.last_login)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Users() {
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

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="users-header mb-4">
        <ul className="nav nav-tabs" role="tablist">
          {TABS.map((tab) => (
            <li className="nav-item" role="presentation" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={tab.id}
                onClick={() => handleTabChange(tab.key)}
              >
                {ROLE_NAMES[tab.key]}
              </button>
            </li>
          ))}
        </ul>
        <div className="users-header">
          <div ref={searchRef} className="users-search-dropdown-anchor">
            <div className="users-search-box">
              <Input
                id="usersSearch"
                className="users-search"
                type="text"
                value={searchName}
                wrapperClassName="users-search-wrapper"
                autoComplete="off"
                placeholder="Поиск"
                aria-label="Search"
                onChange={(event) => setSearchName(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />

              {searchName.trim() ? (
                <button
                  type="button"
                  className="users-search-action"
                  aria-label="Очистить поиск"
                  onClick={() => setSearchName('')}
                >
                  +
                </button>
              ) : (
                <span
                  className="users-search-action users-search-action--icon"
                  aria-hidden="true"
                />
              )}
            </div>
            {showSearchDropdown ? (
              <div className="users-search-dropdown">
                {isSearchLoading ? (
                  <div className="users-search-dropdown__state">
                    Идет поиск...
                  </div>
                ) : visibleSearchResults.length > 0 ? (
                  visibleSearchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="users-search-dropdown__item"
                      onClick={() => handleSearchResultClick(user)}
                    >
                      <span className="users-search-dropdown__role">
                        {ROLE_NAMES[user.role] ?? user.role}
                      </span>
                      <span className="users-search-dropdown__name">
                        <strong>{user.last_name}</strong> {user.first_name}{' '}
                        {user.middle_name}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="users-search-dropdown__state">
                    Нет результатов
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <Button
            className="primary has-icon"
            iconBefore={<img src={addPlusIcon} alt="add" />}
            data-bs-toggle="modal"
            data-bs-target="#addUserModal"
          >
            Добавить участника
          </Button>
          <Button
            className="bordered has-icon"
            iconAfter={<ArchiveIcon />}
            onClick={handleArchiveToggle}
          >
            {archivedStatus === 'archived' ? 'Активные' : 'Архив'}
          </Button>
        </div>
      </div>
      <div className="tab-content">
        {TABS.map((tab) => (
          <div
            key={tab.key}
            className={`tab-pane fade ${activeTab === tab.key ? 'show active' : ''}`}
            id={tab.id}
            role="tabpanel"
          >
            {activeTab === tab.key && (
              <DataTable
                columns={columns}
                data={displayedUsers}
                keyExtractor={(u) => u.id}
                expandedId={expandedUserId}
                onRowClick={handleRowClick}
                renderExpanded={(u) => <UserDetails user={u} />}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                emptyMessage="Нет активных пользователей"
              />
            )}
          </div>
        ))}
      </div>
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
      <AddUserModal />
    </>
  );
}

export default Users;
