import ROLES from 'const/roles';
import { useUserApprovals } from './useUserApprovals';
import { useRecipeApprovals } from './useRecipeApprovals';
import type { INotificationSection } from 'types/notifications.types';

export function useNotifications(role: string) {
  const userApprovals = useUserApprovals({ enabled: role === ROLES.ADMIN });
  const recipeApprovals = useRecipeApprovals({
    enabled: role === ROLES.HEAD_DOCTOR,
  });

  const sections: INotificationSection[] = [
    userApprovals,
    recipeApprovals,
  ].filter((s) => s.totalCount > 0 || s.isLoading || s.error);

  const totalCount = sections.reduce((sum, s) => sum + s.totalCount, 0);

  return { sections, totalCount };
}
