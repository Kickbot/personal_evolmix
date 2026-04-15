import ROLES from 'const/roles';
import { useUserApprovals } from './useUserApprovals';
import type { INotificationSection } from 'types/notifications.types';

export function useNotifications(role: string) {
  const userApprovals = useUserApprovals({ enabled: role === ROLES.ADMIN });
  // const recipeApprovals = useRecipeApprovals({ enabled: role === 'chief_doctor' });

  const sections: INotificationSection[] = [
    userApprovals,
    // recipeApprovals,
  ].filter((s) => s.totalCount > 0 || s.isLoading || s.error);

  const totalCount = sections.reduce((sum, s) => sum + s.totalCount, 0);

  return { sections, totalCount };
}
