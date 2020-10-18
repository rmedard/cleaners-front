import {Address} from './address';

export interface Person {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressId: number;
  address: Address;
  picture: string;
  userId: number;
}
