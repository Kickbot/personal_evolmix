import { useContext, useState } from 'react';
import Context from 'context';
import ROLES from 'const/roles';
import { DataTable } from 'components/data-table';
import { SearchInput, SearchDropdown } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { Button } from 'ui/button';
import { Select } from 'ui/select';
import { Input } from 'ui/input';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import Loader from 'ui/loader';
import type {
  IRecipeListItem,
  IRecipeDoctorConfirmStatus,
  IRecipeStatus,
} from 'types/recipes.types';
import { recipeColumns } from './recipeColumns';
import { RecipeDetails } from './RecipeDetails';
import { AddRecipeModal } from './AddRecipeModal';
import { useRecipes } from './useRecipes';
import './recipes.css';

const CONFIRM_OPTIONS: {
  value: IRecipeDoctorConfirmStatus | '';
  label: string;
}[] = [
  { value: '', label: 'Все' },
  { value: 'new', label: 'Ожидает' },
  { value: 'confirmed_by_doctor', label: 'Заверено' },
  { value: 'rejected_by_doctor', label: 'Отклонен' },
];

const STATUS_OPTIONS: { value: IRecipeStatus | ''; label: string }[] = [
  { value: '', label: 'Все' },
  { value: 'created', label: 'Новый' },
  { value: 'processing', label: 'В работе' },
  { value: 'completed_success', label: 'Готово' },
  // { value: 'completed_failed', label: 'Ошибка' },
];

export default function Recipes() {
  const [editRecipe, setEditRecipe] = useState<IRecipeListItem | null>(null);
  const { currentUser } = useContext(Context) as {
    currentUser: { role: string };
  };
  const {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedRecipes,
    expandedRecipeId,
    sortField,
    sortDirection,
    confirmFilter,
    statusFilter,
    dateFilter,
    handleConfirmFilterChange,
    handleStatusFilterChange,
    handleDateFilterChange,
    handleArchiveToggle,
    handleArchiveRecipe,
    handleRowClick,
    handleSearchResultClick,
    handleSort,
    currentPage,
    totalPages,
    handlePageChange,
    reloadRecipes,
  } = useRecipes();

  const canCreate =
    currentUser?.role === ROLES.ADMIN ||
    currentUser?.role === ROLES.DOCTOR ||
    currentUser?.role === ROLES.HEAD_DOCTOR;

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="recipes-header mb-4">
        <PageToolbar>
          <div className="recipes-header-wrap">
            <SearchInput
              value={searchName}
              onChange={handleSearchNameChange}
              isLoading={isSearchLoading}
              hasResults={visibleSearchResults.length > 0}
              placeholder="Введите ФИО пациента"
            >
              <SearchDropdown
                items={visibleSearchResults}
                getKey={(r) => r.id}
                onSelect={handleSearchResultClick}
                renderItem={(r) => (
                  <span className="search-dropdown__name">
                    <strong>{r.patient.last_name}</strong>{' '}
                    {r.patient.first_name} {r.patient.middle_name}
                    <span className="search-dropdown__label ms-2">
                      {r.recipe_number}
                    </span>
                  </span>
                )}
              />
            </SearchInput>

            <Select
              id="recipes-status-filter"
              value={statusFilter}
              onChange={(e) =>
                handleStatusFilterChange(e.target.value as IRecipeStatus | '')
              }
              options={STATUS_OPTIONS}
              wrapperClassName="recipes-filter"
            />

            <Select
              id="recipes-confirm-filter"
              value={confirmFilter}
              onChange={(e) =>
                handleConfirmFilterChange(
                  e.target.value as IRecipeDoctorConfirmStatus | '',
                )
              }
              options={CONFIRM_OPTIONS}
              wrapperClassName="recipes-filter"
            />

            <Input
              id="recipes-date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              wrapperClassName="recipes-filter"
            />
          </div>

          {archivedStatus !== 'archived' && canCreate && (
            <Button
              className="primary has-icon"
              iconBefore={<AddPlusIcon />}
              data-bs-toggle="modal"
              data-bs-target="#addRecipeModal"
            >
              Новый рецепт
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
        columns={recipeColumns}
        data={displayedRecipes}
        keyExtractor={(r) => r.id}
        expandedId={expandedRecipeId}
        onRowClick={handleRowClick}
        renderExpanded={(r) => (
          <RecipeDetails
            recipe={r}
            onClose={() => handleRowClick(r.id)}
            onArchive={() => handleArchiveRecipe(r.id, r.is_archived)}
            onEdit={() => setEditRecipe(r)}
          />
        )}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="Нет рецептов"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {canCreate && (
        <AddRecipeModal
          onSuccess={reloadRecipes}
          editRecipe={editRecipe}
          onClose={() => setEditRecipe(null)}
        />
      )}
    </>
  );
}
