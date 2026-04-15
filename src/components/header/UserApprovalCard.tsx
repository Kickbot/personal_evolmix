import { ROLE_NAMES } from 'const/roles';
import { formatDate } from 'utils/date';
import type { IUserListItem } from 'types/users.types';

interface UserApprovalCardProps {
  user: IUserListItem;
}

export function UserApprovalCard({ user }: UserApprovalCardProps) {
  return (
    <div className="approval-user-card__left">
      <h6 className="approval-user-card__title">
        {ROLE_NAMES[user.role] ?? user.role}
      </h6>
      <p className="approval-user-card__name">
        {user.last_name} {user.first_name} {user.middle_name}
      </p>
      <a
        href={`mailto:${user.email_address}`}
        className="approval-user-card__email"
      >
        {user.email_address}
      </a>
      <div className="approval-user-card__meta">
        <span>Регистрация:</span>{' '}
        <strong>{formatDate(user.registration_date)}</strong>
      </div>
    </div>
  );
}
