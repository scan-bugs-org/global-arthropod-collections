import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Expose, plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { CollectionListItem } from './dto/collection-list-item.dto';
import { Collection } from './dto/collection.dto';
import { CollectionGeoJson } from './dto/collection-geojson.dto';

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
            map((collections) => {
                return collections.map((coll) => plainToClass(CollectionListItem, coll));
            }),
            tap(() => this.loading.end())
        );
    }

    collectionGeoJson(tier: number): Observable<CollectionGeoJson[]> {
        let url = `${CollectionService.COLLECTION_URL}?tier=${tier}&geojson=true`;
        this.loading.start();
        return this.http.get<Record<string, unknown>[]>(url).pipe(
            map((collections) => {
                return collections.map((collections) => plainToClass(CollectionGeoJson, collections));
            }),
            tap(() => this.loading.end())
        );
    }

    findByID(id: string): Observable<Collection> {
        const url = `${CollectionService.COLLECTION_URL}/${id}`;
        this.loading.start();
        return this.http.get<Record<string, unknown>>(url).pipe(
            map((collection) => plainToClass(Collection, collection)),
            tap(() => this.loading.end())
        );
    }

    deleteByID(id: string): Observable<boolean> {
        this.loading.start();
        const url = `${CollectionService.COLLECTION_URL}/${id}`;
        return this.http.delete(url, { observe: 'response' })
            .pipe(
                map((response) => response.ok),
                tap(() => this.loading.end())
            );
    }

    updateByID(id: string, collectionData: Partial<Collection>): Observable<Collection> {
        this.loading.start();
        const url = `${CollectionService.COLLECTION_URL}/${id}`;
        return this.http.patch<Record<string, unknown>>(url, collectionData)
            .pipe(
                map((collection) => plainToClass(Collection, collection)),
                tap(() => this.loading.end())
            );
    }
}
