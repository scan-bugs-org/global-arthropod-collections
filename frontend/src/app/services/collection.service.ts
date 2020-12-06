import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CollectionService {
    private static readonly COLLECTION_URL = `${environment.apiUrl}/collections`;

    constructor(private readonly http: HttpClient) { }

    collectionList(): Observable<any> {
        return of(null);
    }
}
