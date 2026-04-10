export interface IGuest {
  email_address?: string | null | undefined;
  password: string | null | undefined;
}

export interface IUser {
  id: string;
  email_address: string;
  avatar_url: string | null;
  token_type: string;
  access_token: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  status: string;
  role: string;
  is_archived: boolean;
}

export interface IAuthResponse {
  success: boolean;
  user: IUser;
}