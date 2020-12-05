import {Reservation} from './reservation';

export interface Billing {
  id: number;
  date: Date;
  totalPrice: number;
  reservations: Reservation[];
}
