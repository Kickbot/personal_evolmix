import type { ReactNode } from 'react';

  export interface INotificationSection {
  key: string;
  title: string;
  items: INotificationItem[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface INotificationItem {
  id: string;
  type: string;
  content: ReactNode;
  actions?: INotificationAction[];
}

export interface INotificationAction {
  label: string;
  icon?: ReactNode;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}
