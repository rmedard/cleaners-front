import {User} from '../user';

export interface LoggedInUser {
  token: string;
  userAccount: {
    user: User;
    customerId: number;
    professionalId: number;
  };
}
