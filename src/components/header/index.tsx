import './header.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui/button';
import Context from 'context';
import routes from 'const/routes';
import ROLES, { ROLE_NAMES } from 'const/roles';
import { navigation, techNavigation } from 'const/navigation';
import type { IUser } from 'types/auth.types';
import defaultAvatar from 'assets/img/default_user.svg';
import logoutIcon from 'assets/icons/logout.svg';
import { NavLink, Link } from 'ui/link';
import { NotificationModal } from './notificationModal';
import { IconButton } from 'ui/button';

export function Header() {
  const { currentUser, setCurrentUser } = useContext(Context) as {
    currentUser: IUser | null;
    setCurrentUser: (user: IUser | null) => void;
  };
  const navigate = useNavigate();

  const role = currentUser?.role ?? '';
  const menuItems =
    role === ROLES.OPERATOR
      ? techNavigation
      : navigation.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setCurrentUser(null);
    navigate(routes.login, { replace: true });
  };

  return (
    <div className="row">
      <div className="col-12 header">
        <div className="header-left">
          <Link to={routes.dashboard} className="header-logo">
            {' '}
          </Link>
        </div>
        <div className="header-middle">
          <ul>
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="header-right">
          <div className="user-info">
            <IconButton
              id="notificationTrigger"
              className="user-info-notification"
              data-bs-toggle="modal"
              data-bs-target="#notificationModal"
              aria-label="Открыть уведомления"
            >
              <span className="user-info-notification-badge">3</span>
            </IconButton>
            <div className="user-info-avatar">
              <img
                src={currentUser?.avatar_url || defaultAvatar}
                alt="avatar"
              />
            </div>
          </div>
          <div className="dropdown">
            <div
              className="user-info dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="d-flex flex-column">
                <div className="user-info-name">
                  {currentUser?.last_name} {currentUser?.first_name?.[0]}.
                  {currentUser?.middle_name
                    ? ` ${currentUser.middle_name[0]}.`
                    : ''}
                </div>
                <div className="user-info-role">
                  {ROLE_NAMES[currentUser?.role ?? ''] ?? currentUser?.role}
                </div>
              </div>
            </div>

            <div className="dropdown-menu dropdown-menu-end">
              <Button
                type="button"
                className="w-100 secondary has-icon"
                onClick={handleLogout}
                iconBefore={<img src={logoutIcon} alt="logout" />}
              >
                Выход
              </Button>
            </div>
          </div>
        </div>
      </div>
      <NotificationModal />
    </div>
  );
}
