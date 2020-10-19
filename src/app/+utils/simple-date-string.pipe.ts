import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'simpleDateString'
})
export class SimpleDateStringPipe extends DatePipe implements PipeTransform {

  transform(value: Date, args?: string): string {
    return super.transform(value, 'yyyy-MM-dd HH:mm:ss');
  }

}
