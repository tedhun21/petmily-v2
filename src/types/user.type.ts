import { DayOfWeekType } from './common.type';
import { Pet, PetSpecies } from './pet.type';

export enum UserRole {
  USER = 'user',
  CLIENT = 'client',
  PETSITTER = 'petsitter',
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  role: UserRole;
  address: string;
  detailAddress: string;
  phone: string;
  photo?: string;
  body?: string;
}

export interface Petsitter extends User {
  possibleStartTime?: string;
  possibleEndTime?: string;
  possibleDays?: DayOfWeekType[];
  possibleLocations?: string[];
  possiblePetSpecies?: PetSpecies[];
  star?: number;
  reviewCount?: number;
}

export interface Client extends User {
  pets?: Pet[];
}
