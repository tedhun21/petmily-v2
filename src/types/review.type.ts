import { CoreType } from './common.type';
import { Reservation } from './reservation.type';

export interface Review extends CoreType {
  reservation: Reservation;
  star: number;
  photos?: string[];
  body?: string;
}
