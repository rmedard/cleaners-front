import {Expertise} from './expertise';
import {Billing} from './billing';
import {Recurrence} from './recurrence';

export interface Reservation {
  id: number;
  customerId: number;
  startTime: Date;
  endTime: Date;
  totalCost: number;
  status: string;
  recurrenceId?: number;
  recurrence: Recurrence;
  expertise: Expertise;
  billingId?: number;
  billing: Billing;
}
