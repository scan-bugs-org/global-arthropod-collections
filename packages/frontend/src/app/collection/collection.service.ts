import { Injectable } from "@angular/core";
import { Environment } from "../../environments/environment";
import { Observable, of } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { plainToClass } from "class-transformer";
import { catchError, map, tap } from "rxjs/operators";
import { CollectionListItem } from "./dto/collection-list-item.dto";
import { Collection } from "./dto/collection.dto";
import { CollectionGeoJson } from "./dto/collection-geojson.dto";
import { LoadingService } from "../alert/services/loading.service";

@Injectable()
export class CollectionService {
    private static readonly COLLECTION_URL = `${Environment.apiUrl}/collections`;

    constructor(
        private readonly loading: LoadingService,
        private readonly http: HttpClient) { }

    collectionList(userID: string | null, iid: string | null = null): Observable<CollectionListItem[]> {
        let url = `${CollectionService.COLLECTION_URL}`;
        let qParams = new HttpParams();

        if (userID !== null) {
            qParams.append("user", userID);
        }

        if (iid !== null) {
            qParams.append("iid", iid);
        }

        url += `?${qParams.toString()}`;

        return this.http.get<Record<string, unknown>[]>(url).pipe(
            map((collections) => {
                return collections.map((coll) => plainToClass(CollectionListItem, coll));
            }),
            catchError((e) => {
                console.error(JSON.stringify(e));
                return [];
            })
        );
    }

    collectionGeoJson(tier: number): Observable<CollectionGeoJson[]> {
        let url = `${CollectionService.COLLECTION_URL}?tier=${tier}&geojson=true`;
        return this.http.get<Record<string, unknown>[]>(url).pipe(
            map((collections) => {
                return collections.map((collections) => plainToClass(CollectionGeoJson, collections));
            }),
            catchError((e) => {
                console.error(JSON.stringify(e));
                return [];
            })
        );
    }

    findByID(id: string): Observable<Collection> {
        const url = `${CollectionService.COLLECTION_URL}/${id}`;
        return this.http.get<Record<string, unknown>>(url).pipe(
            map((collection) => plainToClass(Collection, collection)),
        );
    }

    deleteByID(id: string): Observable<boolean> {
        const url = `${CollectionService.COLLECTION_URL}/${id}`;
        return this.http.delete(url, { observe: 'response' })
            .pipe(map((response) => response.ok));
    }

    updateByID(id: string, collectionData: Partial<Collection>): Observable<Collection> {
        const url = `${CollectionService.COLLECTION_URL}/${id}`;
        return this.http.patch<Record<string, unknown>>(url, collectionData)
            .pipe(map((collection) => plainToClass(Collection, collection)));
    }
}
