import { cn } from 'utils';
import './statusBadge.css';

type StatusBadgeStatus =
  | 'active'
  | 'archived'
  | 'created'
  | 'processing'
  | 'completed_success'
  | 'completed_failed'
  | 'completed'
  | 'confirmed_by_pharmacist'
  | 'failed';

type StatusBadgeProps = {
  status: StatusBadgeStatus;
  className?: string;
};

const LABELS: Record<StatusBadgeStatus, string> = {
  active: 'Активен',
  archived: 'Архив',
  created: 'Новый',
  processing: 'В работе',
  completed_success: 'Готово',
  completed_failed: 'Ошибка',
  completed: 'Готово',
  confirmed_by_pharmacist: 'Подтверждено',
  failed: 'Ошибка',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn('status-badge', `status-badge--${status}`, className)}
    >
      {LABELS[status]}
    </span>
  );
}
