import {Address} from './address';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressId: number;
  address: Address;
  picture: string;
  userId: number;
}

export enum UserType {
  CUSTOMER = 'Customer', PROFESSIONAL = 'Professional'
}
