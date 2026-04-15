import { cn } from 'utils';
import './statusBadge.css';

type StatusBadgeProps = {
  status: 'active' | 'archived';
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'status-badge',
        status === 'active' && 'status-badge--active',
        status === 'archived' && 'status-badge--archived',
        className,
      )}
    >
      {status === 'active' ? 'Активен' : 'Архив'}
    </span>
  );
}
