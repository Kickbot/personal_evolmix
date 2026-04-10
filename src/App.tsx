import { lazy, Suspense, useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { user as userApi } from './api';
import './App.css';
import routes from './const/routes';
import ROLES from './const/roles';
import Context from './context';
import ProtectedRoute from './components/protectedRoute';
import GuestRoute from './components/guestRoute';
import Loader from './ui/loader';
import type { IUser } from './types/auth.types';

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Users = lazy(() => import('./pages/dashboard-users'));
const Patients = lazy(() => import('./pages/dashboard-patients'));
const Recipes = lazy(() => import('./pages/dashboard-recipes'));
const Substance = lazy(() => import('./pages/dashboard-substance'));
const Tasks = lazy(() => import('./pages/dashboard-tasks'));
const Warehouse = lazy(() => import('./pages/dashboard-warehouse'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));
const RegisterSuccess = lazy(() => import('./pages/register-success'));

function App() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('access_token'));

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) return;

    userApi.getCurrent()
      .then((data) => setCurrentUser((data as { user: IUser | null }).user))
      .catch((err: { unauthorized?: boolean }) => {
        if (err?.unauthorized) {
          localStorage.removeItem('access_token');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader position="fixed" />;
  }

  return (
    <Context.Provider value={{ currentUser, setCurrentUser }}>
      <Suspense fallback={<Loader position="fixed" />}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path={routes.login} element={<Login />} />
            <Route path={routes.register} element={<Register />} />
            <Route path={routes.registerSuccess} element={<RegisterSuccess />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path={routes.dashboard} element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />

              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="users" element={<Users />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST]} />}>
                <Route path="patients" element={<Patients />} />
                <Route path="recipes" element={<Recipes />} />
                <Route path="substance" element={<Substance />} />
                <Route path="warehouse" element={<Warehouse />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST, ROLES.OPERATOR]} />}>
                <Route path="tasks" element={<Tasks />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={routes.login} replace />} />
        </Routes>
      </Suspense>
    </Context.Provider>
  );
}

export default App;
