import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
    private static readonly INSTITUTION_URL = `${environment.apiUrl}/institutions`;

    constructor(private readonly http: HttpClient) { }

    institutionList(): Observable<any> {
        return of(null);
    }
}
