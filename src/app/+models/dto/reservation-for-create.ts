import {Recurrence} from '../recurrence';

export interface ReservationForCreate {
  customerId: number;
  expertiseForServiceCreate: { professionalId: number, serviceId: number };
  startTime: Date;
  duration: number;
  recurrence: Recurrence;
}
