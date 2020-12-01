import {Address} from './address';
import {RoleUser} from './role-user';

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressId: number;
  address: Address;
  picture: string;
  roles: RoleUser[];
  isActive: boolean;
}

export enum UserType {
  CUSTOMER = 'Customer', PROFESSIONAL = 'Professional'
}
