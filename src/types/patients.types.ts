export interface IPatientResponse {
  success: boolean;
  total: number;
  patients: IPatientListItem[];
}

export interface IPatientListItem {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  identification_number: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  weight: number | null;
  height: number | null;
  department: string;
  room_number: number | null;
  avatar_url: string | null;
  is_archived: boolean;
  doctor: IDoctorListItem | null;
}

export interface IDoctorListItem {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  is_archived: boolean;
}

export interface IPatientSearchParams {
  name?: string | null;
  barcode?: string | null;
  gender?: 'male' | 'female' | 'other' | 'unknown' | null;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  doctor_id?: string | null;
  archived_status?: 'all' | 'archived' | 'nonarchived';
  limit?: number;
  offset?: number;
}

export interface IPatientPatchData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  identification_number?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  weight?: number | null;
  height?: number | null;
  department?: string;
  room_number?: number | null;
  is_archived?: boolean;
  doctor_id?: string | null;
}

export interface IPatientPatchResponse {
  success: boolean;
  patient: IPatientListItem;
}

export interface IPatientSearchResponse {
  success: boolean;
  total: number;
  patients: IPatientListItem[];
}