import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../+models/user';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  updateUser(user: User): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/Users/${user.userId}`, user, httpOptions);
  }
}
