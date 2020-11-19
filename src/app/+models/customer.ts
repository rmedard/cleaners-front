import {User} from './user';
import {Reservation} from './reservation';

export interface Customer {
  id: number;
  userId: number;
  user: User;
  reservations: Reservation[];
  isActive: boolean;
}
