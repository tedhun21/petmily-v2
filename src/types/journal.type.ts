import { CoreType } from './common.type';
import { Reservation } from './reservation.type';

export interface Journal extends CoreType {
  reservation: Reservation;
  photos: string[];
  body?: string;
}
