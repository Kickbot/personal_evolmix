import { Outlet } from 'react-router-dom';
import { Header } from 'components/header';
import './layout.css';

export default function DashboardLayout() {
  return (
    <div className="container-fluid dashboard-page">
      <Header />
      <div className="row flex-grow-1">
        <div className="col-12 dashboard-content">
          <div className="dashboard-content-wrap"> 
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
