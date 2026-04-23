import { useEffect, useState } from 'react';
import { recipe as recipeApi } from 'api';
import { usePagination } from 'hooks/usePagination';
import type {
  IRecipeListItem,
  IRecipeSearchBody,
  IRecipeSearchQueryParams,
  IRecipesResponse,
} from 'types/recipes.types';

interface UseRecipeConfirmOptions {
  recipeId?: string;
}

export function useRecipeConfirm({ recipeId }: UseRecipeConfirmOptions = {}) {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, setTotal }
    = usePagination();
  const [recipes, setRecipes] = useState<IRecipeListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(recipeId || null);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setExpandedRecipeId(null);
  };

  const handleRowClick = (recipeId: string) => {
    setExpandedRecipeId((current) => (current === recipeId ? null : recipeId));
  };

  const handleToggleConfirm = async (recipeId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'new' ? 'confirmed_by_doctor' : 'new';
    try {
      await recipeApi.patchRecipe(recipeId, {
        doctor_confirm_status: nextStatus,
      });
      setRecipes((current) => current.filter((r) => r.id !== recipeId));
      setExpandedRecipeId(null);
      window.dispatchEvent(new CustomEvent('recipe-approval-updated'));
    } catch {
      setError('Не удалось изменить статус рецепта');
    }
  };

  const handleReject = async (recipeId: string) => {
    try {
      await recipeApi.patchRecipe(recipeId, {
        doctor_confirm_status: 'rejected_by_doctor',
      });
      setRecipes((current) => current.filter((r) => r.id !== recipeId));
      setExpandedRecipeId(null);
      window.dispatchEvent(new CustomEvent('recipe-approval-updated'));
    } catch {
      setError('Не удалось отклонить рецепт');
    }
  };

  useEffect(() => {
    const body: IRecipeSearchBody = {
      doctor_confirm_status: 'new',
      is_archived: false,
    };

    const query: IRecipeSearchQueryParams = { limit: pageSize, offset };

    (recipeApi.postSearchRecipe(body, query) as Promise<IRecipesResponse>)
      .then((data) => {
        setError(null);
        setTotal(data.total);
        setRecipes(data.recipes);
      })
      .catch(() => {
        setRecipes([]);
        setError('Не удалось загрузить рецепты на подтверждение');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [offset, pageSize, setTotal]);

  return {
    isLoading,
    error,
    displayedRecipes: recipes,
    expandedRecipeId,
    handleRowClick,
    handleToggleConfirm,
    handleReject,
    currentPage,
    totalPages,
    handlePageChange,
  };
}
