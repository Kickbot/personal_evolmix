import { cn } from 'utils';
import { CheckCircleIcon, CloseIcon, TimeIcon } from 'ui/icons';
import type { IRecipeDoctorConfirmStatus } from 'types/recipes.types';
import './confirmStatusBadge.css';

type ConfirmStatusBadgeProps = {
  status: IRecipeDoctorConfirmStatus;
  className?: string;
};

const LABELS: Record<IRecipeDoctorConfirmStatus, string> = {
  new: 'Ожидает',
  confirmed_by_doctor: 'Заверено',
  rejected_by_doctor: 'Отклонено',
};

const ICONS: Record<IRecipeDoctorConfirmStatus, React.ComponentType> = {
  new: TimeIcon,
  confirmed_by_doctor: CheckCircleIcon,
  rejected_by_doctor: CloseIcon,
};

export function ConfirmStatusBadge({
  status,
  className,
}: ConfirmStatusBadgeProps) {
  const Icon = ICONS[status];
  return (
    <>
      <div
        className={cn(
          'confirm-status-badge',
          `confirm-status-badge--${status}`,
          className,
        )}
      >
        <Icon />
        <span>{LABELS[status]}</span>
      </div>
    </>
  );
}
