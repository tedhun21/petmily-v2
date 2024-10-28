export interface CoreType {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface InfiniteType<T> {
  results: T[];
  pagination: PaginationType;
}

export interface PaginationType {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
