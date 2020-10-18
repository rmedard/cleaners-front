import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ellipsis'})
export class EllipsisPipe implements PipeTransform {
  transform(value: string, args: number): string {
    if (args === undefined) {
      return value;
    }

    if (value.length > args) {
      return value.substring(0, args) + '...';
    } else {
      return value;
    }
  }
}
