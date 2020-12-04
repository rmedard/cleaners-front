import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Expertise} from '../+models/expertise';
import {AvailableExpertiseSearchDto} from '../+models/dto/available-expertise-search-dto';
import {Professional} from '../+models/professional';
import {ProfessionalForCreate} from '../+models/dto/professional-for-create';
import {AddExpertiseToProfessional} from '../+models/dto/add-expertise-to-professional';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAvailable(searchDto: AvailableExpertiseSearchDto): Observable<Expertise[]> {
    return this.http
      .post<Expertise[]>(`${this.baseUrl}/Expertises/available`, searchDto, httpOptions)
      .pipe(map(response => {
        if (this.authService.hasRole('Professional')) {
          const loggedInProfessionalId = this.authService.getLoggedInUser().userAccount.professionalId;
          return (response as Expertise[]).filter(e => e.professionalId !== loggedInProfessionalId);
        }
        return response;
      }));
  }

  createProfessional(professional: ProfessionalForCreate): Observable<Professional> {
    return this.http.post<Professional>(`${this.baseUrl}/Professionals`, professional, httpOptions);
  }

  addProfessionalROle(userId: number, professional: Professional): Observable<Professional> {
    return this.http.post<Professional>(`${this.baseUrl}/Professionals/${userId}/addProfessionalRole`, professional, httpOptions);
  }

  getProfessional(professionalId: number): Observable<Professional> {
    return this.http.get<Professional>(`${this.baseUrl}/Professionals/${professionalId}`, httpOptions);
  }

  updateExpertise(expertise: Expertise): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Expertises/${expertise.id}`, expertise, httpOptions);
  }

  grantExpertise(grantExpertise: AddExpertiseToProfessional, professionalId: number): Observable<Professional> {
    return this.http.post<Professional>(`${this.baseUrl}/Professionals/${professionalId}/expertises`, grantExpertise, httpOptions);
  }
}
