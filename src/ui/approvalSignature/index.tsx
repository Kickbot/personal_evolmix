import { cn } from 'utils';
import { CheckCircleIcon, CloseIcon, TimeIcon } from 'ui/icons';
import { formatDate } from 'utils/date';
import type { IRecipeDoctorConfirmStatus } from 'types/recipes.types';
import './approvalSignature.css';

type ApprovalSignatureProps = {
  status: IRecipeDoctorConfirmStatus;
  role: string;
  name: string;
  signedAt?: string | null;
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

export function ApprovalSignature({
  status,
  role,
  name,
  signedAt,
  className,
}: ApprovalSignatureProps) {
  const Icon = ICONS[status];
  return (
    <div
      className={cn(
        'approval-signature',
        `approval-signature--${status}`,
        className,
      )}
    >
      <div className="approval-signature__icon">
        <Icon />
      </div>
      <div className="approval-signature__label">{LABELS[status]}</div>
      <div className="approval-signature__role">{role}</div>
      <div className="approval-signature__name">{name || '—'}</div>
      <div className="approval-signature__date">
        <span>Подписано:</span>
        <span className='approval-signature-signed-at'>{signedAt ? formatDate(signedAt) : '—'}</span>
      </div>
    </div>
  );
}
