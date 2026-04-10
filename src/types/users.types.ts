export interface IUserListItem {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email_address: string;
  role: string;
  status: string;
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
  limit: number;
  offset: number;
}
