export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum Species {
  DOG = 'Dog',
  CAT = 'Cat',
}

export interface Pet {
  id: number;
  name: string;
  gender: Gender;
  species: Species;
  breed: string;
  age: number;
  weight: number;
  neutering: boolean;
  body?: string;
  photo?: string;
}
