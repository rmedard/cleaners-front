import {Expertise} from './expertise';
import {Billing} from './billing';
import {Recurrence} from './recurrence';
import {Customer} from './customer';

export interface Reservation {
  id: number;
  customerId: number;
  customer: Customer;
  startTime: Date;
  endTime: Date;
  totalCost: number;
  status: Status;
  recurrenceId?: number;
  recurrence: Recurrence;
  expertise: Expertise;
  billingId?: number;
  billing: Billing;
}

export enum Status {
  CONFIRMED = 'Confirmed', REJECTED = 'Confirmed'
}

