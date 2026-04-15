import { useCallback, useEffect, useState } from 'react';
import { user as userApi } from 'api';
import type { IUserListItem, IUserPatchResponse } from 'types/users.types';
import type { INotificationSection } from 'types/notifications.types';
import { UserApprovalCard } from 'components/header/UserApprovalCard';
import { CheckCircleIcon } from 'ui/icons/CheckCircleIcon';
import { CloseIcon } from 'ui/icons/CloseIcon';

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;
const APPROVALS_UPDATED_EVENT = 'user-approval-updated';

interface UseUserApprovalsOptions {
  enabled?: boolean;
}

export function useUserApprovals({ enabled = true }: UseUserApprovalsOptions = {}): INotificationSection {
  const [approvals, setApprovals] = useState<IUserListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifyApprovalsUpdated = () => {
    window.dispatchEvent(new CustomEvent(APPROVALS_UPDATED_EVENT));
  };

  const loadApprovals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = (await userApi.search({
        status: 'inactive',
        archived_status: 'nonarchived',
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
      })) as { users: IUserListItem[]; total: number };
      setApprovals(response.users ?? []);
      setTotalCount(response.total ?? 0);
    } catch {
      setError('Не удалось загрузить заявки');
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
    const handleApprovalsUpdated = () => {
      void loadApprovals();
    };
    window.addEventListener(APPROVALS_UPDATED_EVENT, handleApprovalsUpdated);
    return () => {
      window.removeEventListener(APPROVALS_UPDATED_EVENT, handleApprovalsUpdated);
    };
  }, [loadApprovals, enabled]);

  const approveUser = async (userId: string) => {
    try {
      const response = (await userApi.patchUser(userId, {
        status: 'active',
      })) as IUserPatchResponse;
      if (response.success) {
        setApprovals((current) => current.filter((u) => u.id !== userId));
        setTotalCount((current) => Math.max(0, current - 1));
        notifyApprovalsUpdated();
      }
    } catch {
      setError('Не удалось подтвердить пользователя');
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      const response = (await userApi.patchUser(userId, {
        status: 'blocked',
      })) as IUserPatchResponse;
      if (response.success) {
        setApprovals((current) => current.filter((u) => u.id !== userId));
        setTotalCount((current) => Math.max(0, current - 1));
        notifyApprovalsUpdated();
      }
    } catch {
      setError('Не удалось отклонить пользователя');
    }
  };

  return {
    key: 'user-approvals',
    title: 'Запрос на утверждение',
    totalCount,
    isLoading,
    error,
    items: approvals.map((user) => ({
      id: user.id,
      type: 'user-approval',
      content: <UserApprovalCard user={user} />,
      actions: [
        {
          label: 'Подтвердить',
          icon: <CheckCircleIcon />,
          variant: 'primary' as const,
          onClick: () => void approveUser(user.id),
        },
        {
          label: 'Отменить',
          icon: <CloseIcon />,
          variant: 'secondary' as const,
          onClick: () => void rejectUser(user.id),
        },
      ],
    })),
  };
}
