export interface ISolventListItem {
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

export interface ISolventResponse {
  success: boolean;
  total: number;
  solvents: ISolventListItem[];
}

export interface ISolventSearchParams {
  name?: string | null;
  archived_status?: 'all' | 'archived' | 'nonarchived';
  order_by?: string;
  sort_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
