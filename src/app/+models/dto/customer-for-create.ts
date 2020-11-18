import {Customer} from '../customer';

export interface CustomerForCreate {
  customer: Customer;
  password: string;
}
