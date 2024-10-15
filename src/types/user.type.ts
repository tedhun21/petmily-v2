export enum UserRole {
  USER = 'User',
  CLIENT = 'Client',
  PETSITTER = 'Petsitter',
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
  photo: string;
  body: string;
}
