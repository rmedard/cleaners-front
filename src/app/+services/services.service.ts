import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Service} from '../+models/service';
import {Expertise} from '../+models/expertise';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/Services`);
  }

  getService(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/Services/${serviceId}`);
  }

  getExpertisesByService(serviceId: number): Observable<Expertise[]> {
    return this.http.get<Expertise[]>(`${this.baseUrl}/Expertises?serviceId=${serviceId}`);
  }
}
