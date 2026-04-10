import { ROLE_NAMES } from 'const/roles';
import type { IUserListItem } from 'types/users.types';
import { formatDateTime } from 'utils/date';

export function UserDetails({ user }: { user: IUserListItem }) {
  return (
    <div className="dt-details p-3">
      <div className="row">
        <div className="col-md-6">
          <div className="dt-details-data p-3">
            <p>
              <strong>Фамилия:</strong> {user.last_name}
            </p>
            <p>
              <strong>Имя:</strong> {user.first_name}
            </p>
            <p>
              <strong>Отчество:</strong> {user.middle_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email_address}
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dt-details-data p-3">
            <p>
              <strong>Роль:</strong> {ROLE_NAMES[user.role] ?? user.role}
            </p>
            <p>
              <strong>Статус:</strong> {user.status}
            </p>
            <p>
              <strong>Дата регистрации:</strong>{' '}
              {formatDateTime(user.registration_date)}
            </p>
            <p>
              <strong>Последний вход:</strong>{' '}
              {formatDateTime(user.last_login)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
