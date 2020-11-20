import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Email} from '../+models/email';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  sendEmail(email: Email): Observable<any> {
    return this.http.post(this.baseUrl + '/Mails', email, httpOptions);
  }

}
