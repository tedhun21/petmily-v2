import { CoreType } from './common.type';
import { Journal } from './journal.type';
import { Pet } from './pet.type';
import { Review } from './review.type';
import { Petsitter, User } from './user.type';

export enum ReservationStatus {
  PENDING = 'pending',
  CANCELED = 'canceled',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
}

export interface Reservation extends CoreType {
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  detailAddress: string;
  zipcode: string;
  status: ReservationStatus;
  client: User;
  petsitter: Petsitter;
  body: string;
  pets: Pet[];

  review?: Review;
  journal?: Journal;
}
