export interface RouteParams {
  table: string;
}

export interface TableSchema {
  rowKey: string;
  options: any;
  columns: ProColumns<T, ValueType>[];
}

export interface TableItem {
  [x: string]: any;
}

export interface UploadItem {
  loading?: boolean;
  url?: string;
}

export interface TablePagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableData {
  list: TableItem[];
  pagination: Partial<TablePagination>;
}

export interface TableParams {
  id?: number;
  mobile?: string;
  username?: string;
  nickname?: string;
  email?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
