export type SortDirection = 'none' | 'asc' | 'desc';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
}
