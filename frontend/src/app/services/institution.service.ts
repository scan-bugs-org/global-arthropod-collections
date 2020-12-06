import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Institution } from './dto/institution-list-item.dto';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
    private static readonly INSTITUTION_URL = `${environment.apiUrl}/institutions`;

    constructor(
        private readonly http: HttpClient,
        private readonly loading: LoadingService) { }

    institutionList(): Observable<Institution[]> {
        this.loading.start();
        return this.http.get<Record<string, unknown>[]>(`${InstitutionService.INSTITUTION_URL}`)
            .pipe(
                map((institutionList) => {
                    return institutionList.map((inst) => {
                        return plainToClass(Institution, inst)
                    });
                }),
                tap(() => this.loading.end())
            );
    }
}
