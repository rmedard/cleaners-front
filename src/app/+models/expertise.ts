import {Service} from './service';
import {Professional} from './professional';

export interface Expertise {
  id: number;
  serviceId: number;
  professionalId: number;
  hourlyRate: number;
  service: Service;
  professional: Professional;
  isActive: boolean;
}
