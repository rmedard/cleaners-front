import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Reservation} from '../+models/reservation';
import {Observable} from 'rxjs';
import {ReservationForCreate} from '../+models/dto/reservation-for-create';
import {ReservationSearchCriteriaDto} from '../+models/dto/reservation-search-criteria-dto';

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

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/Reservations`, httpOptions);
  }

  cancelReservation(reservationId: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/Reservations/${reservationId}/cancel`, httpOptions);
  }

  searchReservation(searchDto: ReservationSearchCriteriaDto): Observable<Reservation[]> {
    console.log(searchDto);
    return this.http.post<Reservation[]>(`${this.baseUrl}/Reservations/search`, searchDto, httpOptions);
  }

  generateUpcomingReservations(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/Reservations/generate-reservations`, httpOptions);
  }
}
