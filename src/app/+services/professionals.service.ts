import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Expertise} from '../+models/expertise';
import {AvailableExpertiseSearchDto} from '../+models/dto/available-expertise-search-dto';
import {Professional} from '../+models/professional';
import {ProfessionalForCreate} from '../+models/dto/professional-for-create';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAvailable(searchDto: AvailableExpertiseSearchDto): Observable<Expertise[]> {
    return this.http.post<Expertise[]>(`${this.baseUrl}/Expertises/available`, searchDto, httpOptions);
  }

  createProfessional(professional: ProfessionalForCreate): Observable<Professional> {
    return this.http.post<Professional>(`${this.baseUrl}/Professionals`, professional, httpOptions);
  }

  getProfessional(professionalId: number): Observable<Professional> {
    return this.http.get<Professional>(`${this.baseUrl}/Professionals/${professionalId}`, httpOptions);
  }
}
