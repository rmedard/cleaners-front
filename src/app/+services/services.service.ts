import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Service} from '../+models/service';
import {Expertise} from '../+models/expertise';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

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

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}/Services`, service, httpOptions);
  }

  updateService(service: Service): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Services/${service.id}`, service, httpOptions);
  }
}
