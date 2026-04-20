export interface ISubstanceResponse {
  success: boolean;
  total: number;
  substances: ISubstanceListItem[];
}

export interface ISubstanceListItem {
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

export interface ISubstanceSearchParams {
  name?: string | null;
  barcode?: string | null;
  archived_status?: 'all' | 'archived' | 'nonarchived';
  order_by?: 'name' | 'concentration' | 'manufacturer' | 'country' | 'lyophilizate';
  sort_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ISubstancePatchData {
  name?: string;
  manufacturer?: string;
  country?: string;
  is_lyophilizate?: boolean;
  concentration?: number;
  density?: number | null;
  is_archived?: boolean;
}

export interface ISubstancePatchResponse {
  success: boolean;
  substance: ISubstanceListItem;
}

export interface ISubstanceCreateData {
  name: string;
  manufacturer: string;
  country: string;
  concentration: number;
  density?: number | null;
  is_lyophilizate: boolean;
}

export interface ISubstanceCreateResponse {
  success: boolean;
  substance: ISubstanceListItem;
}

export interface ISubstanceSearchResponse {
  success: boolean;
  total: number;
  substances: ISubstanceListItem[];
}
