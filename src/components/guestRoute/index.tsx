import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Context from 'context';
import routes from 'const/routes';

function GuestRoute() {
  const { currentUser } = useContext(Context) as { currentUser: { role: string } };
  if (currentUser) {
    return <Navigate to={routes.dashboard} replace />;
  }
  return <Outlet />;
}
export default GuestRoute;