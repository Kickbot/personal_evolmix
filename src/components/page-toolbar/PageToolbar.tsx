import './page-toolbar.css';

interface PageToolbarProps {
  children: React.ReactNode;
}

export function PageToolbar({ children }: PageToolbarProps) {
  return <div className="page-toolbar">{children}</div>;
}
