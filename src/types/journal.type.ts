import type { CoreType } from './common.type';
import type { Reservation } from './reservation.type';

export interface Journal extends CoreType {
  reservation: Reservation;
  photos: string[];
  body?: string;
}
