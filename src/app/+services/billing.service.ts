import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Billing} from '../+models/billing';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getBills(customerId?: number): Observable<Billing[]> {
    const url = customerId ? `${this.baseUrl}/Billing?customerId=${customerId}` : `${this.baseUrl}/Customers`;
    return this.http.get<Billing[]>(url, httpOptions);
  }
}
