import type { IUserListItem } from './users.types';
import type { IRecipeListItem } from './recipes.types';
import type { IWarehouseListItem } from './warehouse.types';
import type { ISolventListItem } from './solvents.types';

/** Жизненный цикл задачи (статус подтверждения фармацевта) */
export type ITaskStatus =
  | 'created'
  | 'confirmed_by_pharmacist'
  | 'completed'
  | 'processing'
  | 'failed';

/** Тип процесса */
export type ITaskProcessType = 'prefilled' | 'nonprefilled';

export type ITaskArchivedStatusParam = 'all' | 'archived' | 'nonarchived';

/** Сообщение об ошибке, привязанное к задаче */
export interface ITaskErrorMessage {
  id: string;
  task_id: string;
  message_text: string;
  created_at: string;
}

/** Один элемент списка задач (TaskGetResponse) */
export interface ITaskListItem {
  id: string;
  created_by_user_id: string | null;
  user_id: string | null;
  pharmacist_id: string | null;
  process_type: ITaskProcessType | null;
  created_at: string;
  processed_at: string | null;
  pharmacist_confirm_status: ITaskStatus;
  is_archived: boolean;
  created_by_user: IUserListItem | null;
  operator: IUserListItem | null;
  pharmacist: IUserListItem | null;
  a_1_solvent: ISolventListItem | null;
  a_2_solvent: ISolventListItem | null;
  b_1_solvent: ISolventListItem | null;
  b_2_solvent: ISolventListItem | null;
  recipes: IRecipeListItem[];
  messages: ITaskErrorMessage[];
  active_substance_packs_a: IWarehouseListItem[];
  active_substance_packs_b: IWarehouseListItem[];
}

/** Query-параметры для GET /task/ и POST /task/search */
export interface ITaskSearchQueryParams {
  limit: number;
  offset: number;
  archived_status?: ITaskArchivedStatusParam;
  order_by?: 'status' | 'pharmacist' | 'date';
  sort_direction?: 'asc' | 'desc';
}

/** Тело POST /task/search */
export interface ITaskSearchBody {
  user_id?: string;
  doctor_id?: string;
  pharmacist_id?: string;
  barcode?: string;
  pharmacist_confirm_status?: ITaskStatus;
  process_type?: ITaskProcessType;
  is_archived?: boolean;
}

/** Тело POST /task/ */
export interface ITaskCreateBody {
  recipes_a?: string[] | null;
  recipes_b?: string[] | null;
  active_substance_packs_a?: string[] | null;
  active_substance_packs_b?: string[] | null;
  a_1_solvent_id?: string | null;
  a_2_solvent_id?: string | null;
  b_1_solvent_id?: string | null;
  b_2_solvent_id?: string | null;
}

/** Тело PATCH /task/{task_id} */
export interface ITaskPatchBody {
  user_id?: string | null;
  pharmacist_id?: string | null;
  a_1_solvent_id?: string | null;
  a_2_solvent_id?: string | null;
  b_1_solvent_id?: string | null;
  b_2_solvent_id?: string | null;
  processed_at?: string | null;
  pharmacist_confirm_status?: ITaskStatus | null;
  is_archived?: boolean | null;
}

/** Тело POST /task/{task_id}/recipes/add */
export interface ITaskAddRecipesBody {
  recipes_a: string[];
  recipes_b: string[];
}

/** Тело POST /task/{task_id}/active-substance-packs/add */
export interface ITaskAddSubstancePacksBody {
  active_substance_packs_a: string[];
  active_substance_packs_b: string[];
}

/** Тело POST /task/{task_id}/messages/add */
export interface ITaskErrorMessageCreateBody {
  message_text: string;
}

export interface ITaskSingleResponse {
  success: boolean;
  task: ITaskListItem;
}

export interface ITasksResponse {
  success: boolean;
  total: number;
  tasks: ITaskListItem[];
}

export type ITaskSearchResponse = ITasksResponse;
