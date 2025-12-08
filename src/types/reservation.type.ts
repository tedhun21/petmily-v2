import type { CoreType } from './common.type';
import type { Journal } from './journal.type';
import type { Pet } from './pet.type';
import type { Review } from './review.type';
import type { Petsitter, User } from './user.type';

export const ReservationStatus = {
  PENDING: 'pending',
  CANCELED: 'canceled',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
} as const;
export type ReservationStatusType = (typeof ReservationStatus)[keyof typeof ReservationStatus];

export interface Reservation extends CoreType {
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  detailAddress: string;
  zipcode: string;
  status: ReservationStatusType;
  client: User;
  petsitter: Petsitter;
  body: string;
  pets: Pet[];
  review?: Review;
  journal?: Journal;
}
