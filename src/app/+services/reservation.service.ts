import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Reservation} from '../+models/reservation';
import {Observable} from 'rxjs';
import {ReservationForCreate} from '../+models/dto/reservation-for-create';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  createOrder(reservation: ReservationForCreate): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/Reservations`, reservation);
  }

}
