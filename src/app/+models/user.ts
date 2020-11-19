import {Address} from './address';
import {RoleUser} from './role-user';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressId: number;
  address: Address;
  picture: string;
  userId: number;
  roles: RoleUser[];
}

export enum UserType {
  CUSTOMER = 'Customer', PROFESSIONAL = 'Professional'
}
