import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Context from 'context';
import routes from 'const/routes';

function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { currentUser } = useContext(Context) as { currentUser: { role: string } };
  if (!currentUser) {
    return <Navigate to={routes.login} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={routes.dashboard} replace />;
  }
  return <Outlet />;
}
export default ProtectedRoute;