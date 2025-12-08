import type { CoreType, DayOfWeekType } from './common.type';
import type { Pet, PetSpeciesType } from './pet.type';

export const UserRole = {
  USER: 'user',
  CLIENT: 'client',
  PETSITTER: 'petsitter',
} as const;
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface User extends CoreType {
  username: string;
  nickname: string;
  email: string;
  role: UserRoleType;
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
  possiblePetSpecies?: PetSpeciesType[];
  star?: number;
  reviewCount?: number;
}

export interface Client extends User {
  pets?: Pet[];
}
