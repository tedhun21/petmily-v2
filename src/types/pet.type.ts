import { CoreType } from './common.type';

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum PetSpecies {
  DOG = 'dog',
  CAT = 'cat',
}

export interface Pet extends CoreType {
  id: number;
  name: string;
  gender: PetGender;
  species: PetSpecies;
  breed: string;
  age: number;
  weight: number;
  neutering: boolean;
  body?: string;
  photo?: string;
}
