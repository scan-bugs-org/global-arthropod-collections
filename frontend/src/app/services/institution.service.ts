import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Institution } from './dto/institution.dto';
import { LoadingService } from './loading.service';
import { CollectionListItem } from './dto/collection-list-item.dto';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
    private static INSTITUTION_URL = Environment.institutionUrl;
    private static COLLECTION_URL = Environment.collectionUrl;

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

    findByID(id: string): Observable<Institution> {
        this.loading.start();
        const url = `${InstitutionService.INSTITUTION_URL}/${id}`;
        return this.http.get<Record<string, unknown>>(url)
            .pipe(
                map((institution) => plainToClass(Institution, institution)),
                tap(() => this.loading.end())
            );
    }

    collections(iid: string): Observable<CollectionListItem[]> {
        this.loading.start();
        const url = `${InstitutionService.COLLECTION_URL}?iid=${encodeURIComponent(iid)}`;
        return this.http.get<Record<string, unknown>[]>(url)
            .pipe(
                map((collections) => {
                    return collections.map((c) => {
                        return plainToClass(CollectionListItem, c)
                    })
                }),
                tap(() => this.loading.end())
            );
    }

    updateByID(id: string, institutionData: Partial<Institution>): Observable<Institution> {
        this.loading.start();
        const url = `${InstitutionService.INSTITUTION_URL}/${id}`;
        return this.http.patch<Record<string, unknown>>(url, institutionData)
            .pipe(
                map((institution) => plainToClass(Institution, institution)),
                tap(() => this.loading.end())
            );
    }

    deleteByID(id: string): Observable<boolean> {
        this.loading.start();
        const url = `${InstitutionService.INSTITUTION_URL}/${id}`;
        return this.http.delete(url, { observe: 'response' })
            .pipe(
                map((response) => response.ok),
                tap(() => this.loading.end())
            );
    }
}
