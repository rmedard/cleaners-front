import {Status} from '../reservation';

export interface ReservationSearchCriteriaDto {
  customerId?: number;
  professionalId?: number;
  status?: Status;
  date?: Date;
  hasBill?: boolean;
}
