export interface CoreType {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationType {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export enum DayOfWeekType {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}
