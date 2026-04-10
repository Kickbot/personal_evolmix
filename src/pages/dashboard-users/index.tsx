import ROLES, { ROLE_NAMES } from 'const/roles';
import { Button } from 'ui/button';
import { ArchiveIcon } from 'ui/icons';
import Loader from 'ui/loader';
import addPlusIcon from 'assets/icons/addPlusIcon.svg';
import { DataTable } from 'components/data-table';
import { SearchInput } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { AddUserModal } from './AddUserModal';
import { userColumns } from './userColumns';
import { UserDetails } from './UserDetails';
import { useUsers } from './useUsers';
import './users.css';

const TABS = [
  { key: ROLES.ADMIN, id: 'admins-pane' },
  { key: ROLES.DOCTOR, id: 'doctors-pane' },
  { key: ROLES.PHARMACIST, id: 'pharmacists-pane' },
  { key: ROLES.OPERATOR, id: 'operators-pane' },
];

function Users() {
  const {
    isLoading,
    activeTab,
    archivedStatus,
    searchName,
    setSearchName,
    isSearchLoading,
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
        <PageToolbar>
          <SearchInput
            value={searchName}
            onChange={setSearchName}
            isLoading={isSearchLoading}
          >
            {visibleSearchResults.length > 0
              ? visibleSearchResults.map((user) => (
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
              : null}
          </SearchInput>
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
        </PageToolbar>
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
                columns={userColumns}
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
