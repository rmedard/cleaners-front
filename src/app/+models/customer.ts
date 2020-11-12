import {User} from './user';

export interface Customer {
  id: number;
  user: User;
  isActive: boolean;
}
