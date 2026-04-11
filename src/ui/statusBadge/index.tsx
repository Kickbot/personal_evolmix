import { cn } from 'utils';
import './statusBadge.css';

export function StatusBadge({ status }: { status: 'active' | 'archived' }) {
  return (
    <span
      className={cn(
        'status-badge',
        status === 'active' && 'status-badge--active',
        status === 'archived' && 'status-badge--archived',
      )}
    >
      {status === 'active' ? 'Активен' : 'Архив'}
    </span>
  );
}
