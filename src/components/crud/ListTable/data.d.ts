export interface Props {
  table: string;
  query?: Record<string, any>;
  proTableProps?: Record<string, any>;
  hiddenColumns?: string[];
  renderColumns?: Record<string, any>;
  renderColumnsOptions?: Record<string, any>;
  renderToolbarOptions?: Record<string, any>;
  renderBatchOptions?: Record<string, any>;
}

export interface TableSchema {
  rowKey: string;
  options: any;
  columns: ProColumns<T, ValueType>[];
}

export interface TableOption {
  type: string;
  key: string;
  title: string;
  target: string;
  request?: Record<string, any>;
  body?: Record<string, any>;
}

export type TableItem = Record<string, any>;

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
