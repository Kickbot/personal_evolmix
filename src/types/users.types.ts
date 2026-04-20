export interface IUserResponse {
  success: boolean;
  total: number;
  users: IUserListItem[];
}

export interface IUserListItem {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email_address: string;
  role: string;
  status: string;
  department: string | null;
  is_archived: boolean;
  last_login: string | null;
  registration_date: string;
  avatar_url: string | null;
}

export interface IUserSearchParams {
  name?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'blocked';
  archived_status?: 'all' | 'archived' | 'nonarchived';
  order_by?: 'date' | 'full_name';
  sort_direction?: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface IUserDetailsProps {
  user: IUserListItem;
  onClose: () => void;
  onArchive: () => void;
  onEdit: (user: IUserListItem) => void;
}

export interface IUserPatchData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email_address?: string;
  status?: 'active' | 'inactive' | 'blocked';
  password?: string;
  role?: string;
  is_archived?: boolean;
  department?: string;
}

export interface IUserPatchResponse {
  success: boolean;
  user: IUserListItem;
}
