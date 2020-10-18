import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Service} from '../+models/service';
import {ServicesService} from '../+services/services.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceResolver implements Resolve<Service> {

  constructor(private servicesService: ServicesService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Service> | Promise<Service> | Service {
    let serviceId;
    if (route.params.id) {
      serviceId = route.params.id;
    }
    return this.servicesService.getService(serviceId);
  }

}
