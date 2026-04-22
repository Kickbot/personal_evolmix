import type { IPatientListItem } from './patients.types';
import type { IUserListItem } from './users.types';

export interface IRecipesResponse {
  success: boolean;
  total: number;
  recipes: IRecipeListItem[];
}

export interface IRecipeSingleResponse {
  success: boolean;
  recipe: IRecipeListItem;
}

export type IRecipeSearchResponse = IRecipesResponse;

export type IRecipeArchivedStatusParam = 'all' | 'archived' | 'nonarchived';

/** Жизненный цикл изготовления рецепта */
export type IRecipeStatus =
  | 'created'
  | 'processing'
  | 'completed_success'
  | 'completed_failed';

/** Статус подтверждения главврачом */
export type IRecipeDoctorConfirmStatus =
  | 'new'
  | 'confirmed_by_doctor'
  | 'rejected_by_doctor';

export interface IRecipeSearchQueryParams {
  limit: number;
  offset: number;
  archived_status?: IRecipeArchivedStatusParam;
  order_by?: 'status' | 'full_name' | 'gender' | 'date' | 'doctor_confirm_status';
  sort_direction?: 'asc' | 'desc';
}

/** Тело поиска: все поля необязательны */
export interface IRecipeSearchBody {
  recipe_number?: string;
  recipie_type?: string;
  patient_id?: string;
  patient_name?: string;
  doctor_id?: string;
  task_id?: string;
  status?: IRecipeStatus;
  doctor_confirm_status?: IRecipeDoctorConfirmStatus;
  is_archived?: boolean;
  created_at?: string;
}

export interface IRecipeCreateBody {
  solvent_dosage: number;
  active_substance_dosage: number;
  patient_id: string;
  doctor_id: string;
  solvent_id: string;
  active_substance_id: string;
  task_id?: string;
}

export interface IRecipeCreateResponse {
  success: boolean;
  recipe: IRecipeListItem;
}

export interface IRecipePatchBody {
  recipie_type?: string;
  solvent_dosage?: number;
  active_substance_dosage?: number;
  patient_id?: string;
  doctor_id?: string;
  solvent_id?: string;
  active_substance_id?: string;
  task_id?: string;
  is_solvent_prefilled?: boolean;
  doctor_confirm_status?: IRecipeDoctorConfirmStatus;
  is_archived?: boolean;
}

export interface IRecipeListItem {
  id: string;
  recipe_number: string;
  /** Имя поля как в API (опечатка recipie) */
  recipie_type: string;
  solvent_dosage: number;
  active_substance_dosage: number;
  active_substance_dosage_ml: number;
  total_dosage_ml: number;
  is_solvent_prefilled: boolean;
  is_archived: boolean;
  patient: IPatientListItem;
  doctor: IUserListItem;
  created_by_user: IUserListItem;
  solvent: IRecipeSolvent;
  active_substance: IRecipeActiveSubstance;
  created_at: string;
  updated_at: string | null;
  status: IRecipeStatus;
  doctor_confirm_status: IRecipeDoctorConfirmStatus;
}

export interface IRecipeSolvent {
  id: string;
  name: string;
  manufacturer: string;
  country: string;
  code: string;
  wh_quantity: number | null;
  is_prefilled: boolean;
  prefilled_volume: number;
  is_archived: boolean;
}

export interface IRecipeActiveSubstance {
  id: string;
  name: string;
  manufacturer: string;
  country: string;
  code: string;
  is_lyophilizate: boolean;
  concentration: number;
  density: number | null;
  is_archived: boolean;
}