import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoggedInUser} from '../+models/dto/logged-in-user';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import * as _ from 'underscore';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
  }

  login(email: string, password: string): Observable<LoggedInUser> {
    const loginFormData = new FormData();
    loginFormData.append('Username', email);
    loginFormData.append('Password', password);
    return this.http
      .post<LoggedInUser>(`${this.baseUrl}/auth/login`, loginFormData)
      .pipe(tap(response => {
        localStorage.setItem('user', JSON.stringify(response as LoggedInUser));
      }));
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  loggedIn(): boolean {
    return this.getLoggedInUser() !== null;
  }

  getLoggedInUser(): LoggedInUser {
    const helper = new JwtHelperService();
    const userDate = localStorage.getItem('user');
    let loggedInUser: LoggedInUser = null;
    if (userDate !== null && userDate.trim().length > 0) {
      const user = JSON.parse(userDate) as LoggedInUser;
      if (helper.isTokenExpired(user.token)) {
        localStorage.removeItem('user');
      } else {
        loggedInUser = user;
      }
    }
    return loggedInUser;
  }

  hasRole(roleName: string): boolean {
    if (!this.loggedIn()) {
      return false;
    } else {
      return _.contains(this.getLoggedInUser().userAccount.user.roles.map(r => r.role.roleName), roleName);
    }
  }
}
