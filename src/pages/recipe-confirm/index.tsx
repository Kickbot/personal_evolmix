import { PageToolbar } from 'components/page-toolbar';
import { DataTable } from 'components/data-table';
import { Pagination } from 'components/pagination';
import { IconButton } from 'ui/button';
import { CloseIcon } from 'ui/icons';
import Loader from 'ui/loader';
import routes from 'const/routes';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeConfirmColumns } from './recipeConfirmColumns';
import { RecipeConfirmDetails } from './RecipeConfirmDetails';
import { useRecipeConfirm } from './useRecipeConfirm';
import './recipeConfirm.css';

export default function RecipeConfirm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const {
    isLoading,
    error,
    displayedRecipes,
    expandedRecipeId,
    handleRowClick,
    handleToggleConfirm,
    currentPage,
    totalPages,
    handlePageChange,
  } = useRecipeConfirm({ recipeId: id });

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="recipes-header mb-4">
        <PageToolbar>
          <div className="d-flex align-items-center justify-content-between gap-2 w-100">
          <h4 className="mb-0">Подтверждение рецепта</h4>
          <IconButton
            onClick={() => navigate(routes.recipes)}
            aria-label="Закрыть"
            className="close-button p-0 border-0 bg-transparent"
          >
            <CloseIcon />
          </IconButton>
          </div>
        </PageToolbar>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={recipeConfirmColumns}
        data={displayedRecipes}
        keyExtractor={(r) => r.id}
        expandedId={expandedRecipeId}
        onRowClick={handleRowClick}
        renderExpanded={(r) => (
          <RecipeConfirmDetails
            recipe={r}
            onClose={() => handleRowClick(r.id)}
            onConfirm={() => handleToggleConfirm(r.id, r.doctor_confirm_status)}
          />
        )}
        emptyMessage="Нет рецептов на подтверждение"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
