import { DataTable } from 'components/data-table';
import { SearchInput, SearchDropdown } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { Button } from 'ui/button';
import { Select } from 'ui/select';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import Loader from 'ui/loader';
import { shortName } from 'utils/name';
import type { ITaskStatus } from 'types/tasks.types';
import { taskColumns } from './taskColumns';
import { TaskDetails } from './TaskDetails';
import { useTasks } from './useTasks';
import './tasks.css';

const STATUS_OPTIONS: { value: ITaskStatus | ''; label: string }[] = [
  { value: '', label: 'Все' },
  { value: 'created', label: 'Новый' },
  { value: 'processing', label: 'В работе' },
  { value: 'confirmed_by_pharmacist', label: 'Подтверждено' },
  { value: 'completed', label: 'Готово' },
  { value: 'failed', label: 'Ошибка' },
];

export default function Tasks() {
  const {
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
  } = useTasks();

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="tasks-header mb-4">
        <PageToolbar>
          <div className="tasks-header-wrap">
            <SearchInput
              value={searchName}
              onChange={handleSearchNameChange}
              isLoading={isSearchLoading}
              hasResults={visibleSearchResults.length > 0}
              id="task-search"
              placeholder="Поиск"
            >
              <SearchDropdown
                items={visibleSearchResults}
                getKey={(t) => t.id}
                onSelect={handleSearchResultClick}
                renderItem={(t) => (
                  <span className="search-dropdown__name">
                    <strong>{t.id.slice(0, 12)}</strong>
                    <span className="search-dropdown__label ms-2">
                      {shortName(t.pharmacist)}
                    </span>
                  </span>
                )}
              />
            </SearchInput>

            <Select
              id="tasks-status-filter"
              value={statusFilter}
              onChange={(e) =>
                handleStatusFilterChange(e.target.value as ITaskStatus | '')
              }
              options={STATUS_OPTIONS}
              wrapperClassName="tasks-filter"
            />
          </div>

          {archivedStatus !== 'archived' && (
            <Button
              className="primary has-icon"
              iconBefore={<AddPlusIcon />}
              onClick={() => {}}
            >
              Новое задание
            </Button>
          )}
          <Button
            className="bordered has-icon"
            iconAfter={<ArchiveIcon />}
            onClick={handleArchiveToggle}
          >
            {archivedStatus === 'archived' ? 'Активные' : 'Архив'}
          </Button>
        </PageToolbar>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={taskColumns}
        data={tasks}
        keyExtractor={(t) => t.id}
        expandedId={expandedTaskId}
        onRowClick={handleRowClick}
        renderExpanded={(t) => (
          <TaskDetails task={t} onClose={() => handleRowClick(t.id)} />
        )}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="Нет задач"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
