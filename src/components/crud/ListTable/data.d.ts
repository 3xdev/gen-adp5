import type { ProColumns } from '@ant-design/pro-table';

export interface Props {
  table: string;
  query?: Record<string, any>;
  proTableProps?: Record<string, any>;
  visibleColumns?: string[];
  hiddenColumns?: string[];
  appendColumns?: ProColumns[];
  renderColumns?: Record<string, any>;
  visibleSearch?: string[];
  hiddenSearch?: string[];
  visibleColumnsOptions?: string[];
  appendColumnsOptions?: Partial<TableOption>[];
  renderColumnsOptions?: Record<string, any>;
  visibleToolbarOptions?: string[];
  appendToolbarOptions?: Partial<TableOption>[];
  renderToolbarOptions?: Record<string, any>;
  visibleBatchOptions?: string[];
  appendBatchOptions?: Partial<TableOption>[];
  renderBatchOptions?: Record<string, any>;
}

export interface TableSchema {
  rowKey: string;
  options: any;
  columns: ProColumns<T, ValueType>[];
}

export interface TableOption {
  type: string;
  action: string;
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
