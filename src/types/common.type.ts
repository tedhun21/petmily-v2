export interface CoreType {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface OffsetResponse<T> {
  results: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface CursorResponse<T> {
  results: T[];
  pagination: { hasNextPage: boolean; nextCursor: { id: number; createdAt: string } };
}

export const DayOfWeek = {
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
  SUN: 'sun',
} as const;
export type DayOfWeekType = (typeof DayOfWeek)[keyof typeof DayOfWeek];
