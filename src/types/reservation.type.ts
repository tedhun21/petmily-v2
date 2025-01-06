import { CoreType } from './common.type';
import { User } from './user.type';

export enum Status {
  PENDING = 'Pending',
  CANCELED = 'Canceled',
  ACCEPTED = 'Accepted',
  COMPLETED = 'Completed',
}

export interface Reservation extends CoreType {
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  detailAddress: string;
  zipcode: string;
  status: Status;
  client: User;
  Petsitter: User;
  body: string;
}
