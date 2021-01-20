import { Injectable } from "@angular/core";
import { Environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, ReplaySubject } from "rxjs";
import {
    catchError,
    distinctUntilChanged,
    filter,
    map,
    shareReplay
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { AlertService } from "../alert/services/alert.service";
import GoogleAuth = gapi.auth2.GoogleAuth;

export interface User {
    accessToken: string;
    email: string;
    picture: string;
}

@Injectable()
export class GoogleAuthService {
    private _apiLoading = new BehaviorSubject<boolean>(true);
    user = new ReplaySubject<User>(1);
    isSignedIn = new ReplaySubject<boolean>(1);
    apiLoading = this._apiLoading.asObservable().pipe(
        distinctUntilChanged(),
        shareReplay(1)
    );

    constructor(
        private readonly alert: AlertService,
        private readonly http: HttpClient) {

        GoogleAuthService.loadApi().then(() => {
            const GoogleAuth = gapi.auth2.getAuthInstance();

            GoogleAuth.isSignedIn.listen((isSignedIn) => {
                this.isSignedIn.next(isSignedIn);
            });

            GoogleAuth.currentUser.listen((user) => {
                const authRes = user.getAuthResponse();
                const profile = user.getBasicProfile();

                this.user.next({
                    accessToken: authRes.access_token,
                    email: profile.getEmail(),
                    picture: profile.getImageUrl()
                });

                const loginURL = `${Environment.loginUrl}?id_token=${authRes.id_token}`;
                this.http.post(loginURL, {})
                    .pipe(
                        catchError((e) => {
                            this.alert.showError(JSON.stringify(e));
                            return of(null)
                        })
                    )
                    .subscribe();
            });

            this._apiLoading.next(false);
        });
    }

    getAuthInstance(): Observable<GoogleAuth> {
        return this._apiLoading.pipe(
            filter((loading) => !loading),
            map(() => gapi.auth2.getAuthInstance())
        );
    }

    private static loadApi(): Promise<void> {
        return new Promise<void>((resolve => {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: Environment.googleClientID
                });
                resolve();
            });
        }));
    }
}
