import type { CoreType } from './common.type';
import type { Reservation } from './reservation.type';

export interface Review extends CoreType {
  reservation: Reservation;
  star: number;
  photos?: string[];
  body?: string;
}
