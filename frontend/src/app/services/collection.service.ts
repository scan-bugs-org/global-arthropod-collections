import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Expose, plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { CollectionListItem } from './dto/collection-list-item.dto';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {
    private static readonly COLLECTION_URL = `${Environment.apiUrl}/collections`;

    constructor(
        private readonly loading: LoadingService,
        private readonly http: HttpClient) { }

    collectionList(iid: string | null = null): Observable<CollectionListItem[]> {
        let url = `${CollectionService.COLLECTION_URL}`;
        if (iid !== null) {
            url += `?iid=${iid}`;
        }

        this.loading.start();
        return this.http.get<Record<string, unknown>[]>(url).pipe(
            map((institutions) => {
                return institutions.map((inst) => plainToClass(CollectionListItem, inst));
            }),
            tap(() => this.loading.end())
        );
    }
}
