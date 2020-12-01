import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Customer} from '../+models/customer';
import {Observable} from 'rxjs';
import {CustomerForCreate} from '../+models/dto/customer-for-create';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  createCustomer(customer: CustomerForCreate): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/Customers`, customer, httpOptions);
  }

  addCustomerRole(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/Customers/addAsRole`, customer, httpOptions);
  }

  getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/Customers/${customerId}`, httpOptions);
  }
}
