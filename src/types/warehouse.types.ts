export interface IWarehouseResponse {
  success: boolean;
  total: number;
  substance_packs: IWarehouseListItem[];
}

export interface IActiveSubstance {
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

export interface IWarehouseListItem {
  id: string;
  active_substance_id: string;
  volume: number | null;
  wh_quantity: number | null;
  is_archived: boolean;
  active_substance: IActiveSubstance;
  pure_mass: number | null;
}

export interface IWarehouseSearchParams {
  name?: string | null;
  archived_status?: 'all' | 'archived' | 'nonarchived';
  limit?: number;
  offset?: number;
}

export interface IWarehousePatchData {
  volume?: number | null;
  wh_quantity?: number | null;
  is_archived?: boolean;
}

export interface IWarehousePatchResponse {
  success: boolean;
  substance_pack: IWarehouseListItem;
}

export interface IWarehouseCreateData {
  active_substance_id: string;
  volume?: number | null;
  wh_quantity?: number | null;
}

export interface IWarehouseCreateResponse {
  success: boolean;
  substance_pack: IWarehouseListItem;
}

export interface IWarehouseSearchResponse {
  success: boolean;
  total: number;
  substance_packs: IWarehouseListItem[];
}
