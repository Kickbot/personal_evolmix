import { useCallback, useEffect, useState } from 'react';
import { recipe as recipeApi } from 'api';
import type { IRecipeListItem, IRecipesResponse } from 'types/recipes.types';
import type { INotificationSection } from 'types/notifications.types';
import { RecipeApprovalCard } from 'components/header/RecipeApprovalCard';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;
const APPROVALS_UPDATED_EVENT = 'recipe-approval-updated';

interface UseRecipeApprovalsOptions {
  enabled?: boolean;
}

export function useRecipeApprovals({
  enabled = true,
}: UseRecipeApprovalsOptions = {}): INotificationSection {
  const [approvals, setApprovals] = useState<IRecipeListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApprovals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = (await recipeApi.postSearchRecipe(
        { doctor_confirm_status: 'new', is_archived: false },
        { limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET },
      )) as IRecipesResponse;
      setApprovals(response.recipes ?? []);
      setTotalCount(response.total ?? 0);
    } catch {
      setError('Не удалось загрузить рецепты на подтверждение');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void loadApprovals();
  }, [loadApprovals, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      void loadApprovals();
    };
    window.addEventListener(APPROVALS_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener(APPROVALS_UPDATED_EVENT, handler);
    };
  }, [loadApprovals, enabled]);

  return {
    key: 'recipe-approvals',
    title: 'Новые рецепты:',
    totalCount,
    isLoading,
    error,
    className: 'approval-section--compact',
    itemsClassName: 'recipe-approval-list',
    items: approvals.map((r) => ({
      id: r.id,
      type: 'recipe-approval',
      href: `/dashboard/recipes/confirm/${r.id}`,
      className: 'recipe-approval-card',
      content: <RecipeApprovalCard recipeNumber={r.recipe_number} />,
    })),
  };
}
