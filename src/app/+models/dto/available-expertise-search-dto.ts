import {FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {SimpleDateStringPipe} from '../../+utils/simple-date-string.pipe';

export interface AvailableExpertiseSearchDto {
  serviceId: number;
  dateTime: string;
  duration: number;
  order: Order;
}

export class AvailableExpertiseSearch implements AvailableExpertiseSearchDto {
  dateTime: string;
  duration: number;
  serviceId: number;
  order: Order;

  constructor(formGroup: FormGroup, dateFormatter: SimpleDateStringPipe, serviceIdentifier: number) {
    const availableExpertisesModel = formGroup.value;
    const ngbServiceDateStruct = availableExpertisesModel.serviceDateField;
    const serviceDate = moment(`${ngbServiceDateStruct.day}-${ngbServiceDateStruct.month}-${ngbServiceDateStruct.year}`, 'DD-MM-YYYY')
      .hours(availableExpertisesModel.serviceHourRange[0])
      .toDate();
    this.dateTime = dateFormatter.transform(serviceDate);
    this.duration = availableExpertisesModel.serviceHourRange[1] - availableExpertisesModel.serviceHourRange[0];
    this.serviceId = serviceIdentifier;
    this.order = availableExpertisesModel.sorting as Order;
  }
}

export enum Order {
  DESC = 'Desc', ASC = 'Asc'
}
