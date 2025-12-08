import type { CoreType } from './common.type';

export const PetGender = {
  MALE: 'male',
  FEMALE: 'female',
} as const;
export type PetGenderType = (typeof PetGender)[keyof typeof PetGender];

export const PetSpecies = {
  DOG: 'dog',
  CAT: 'cat',
} as const;
export type PetSpeciesType = (typeof PetSpecies)[keyof typeof PetSpecies];

export interface Pet extends CoreType {
  id: number;
  name: string;
  gender: PetGenderType;
  species: PetSpeciesType;
  breed: string;
  age: number;
  weight: number;
  neutering: boolean;
  body?: string;
  photo?: string;
}
