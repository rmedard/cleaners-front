import {User} from './user';
import {Expertise} from './expertise';

export interface Professional {
  id: number;
  user: User;
  expertises: Expertise[];
  isActive: boolean;
}
