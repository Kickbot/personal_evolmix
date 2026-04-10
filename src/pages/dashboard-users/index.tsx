import ROLES, { ROLE_NAMES } from 'const/roles';
import type { IUserListItem } from 'types/users.types';
import { Button } from 'ui/button';
import { ArchiveIcon } from 'ui/icons';
import { Input } from 'ui/input';
import Loader from 'ui/loader';
import addPlusIcon from 'assets/icons/addPlusIcon.svg';
import { formatDate, formatDateTime } from 'utils/date';
import { DataTable } from 'components/data-table';
import type { ColumnDef } from 'components/data-table';
import { Pagination } from 'components/pagination';
import { AddUserModal } from './AddUserModal';
import { useUsers } from './useUsers';
import './users.css';

const TABS = [
  { key: ROLES.ADMIN, id: 'admins-pane' },
  { key: ROLES.DOCTOR, id: 'doctors-pane' },
  { key: ROLES.PHARMACIST, id: 'pharmacists-pane' },
  { key: ROLES.OPERATOR, id: 'operators-pane' },
];

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
  const {
    isLoading,
    activeTab,
    archivedStatus,
    searchName,
    setSearchName,
    isSearchLoading,
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
  } = useUsers();

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
