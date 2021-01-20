import { Injectable } from "@angular/core";
import { Environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, ReplaySubject } from "rxjs";
import {
    catchError,
    distinctUntilChanged,
    filter,
    map,
    shareReplay, take
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { AlertService } from "../alert/services/alert.service";
import GoogleAuth = gapi.auth2.GoogleAuth;
import { Router } from "@angular/router";

export interface User {
    accessToken: string;
    email: string;
    picture: string;
}

@Injectable()
export class GoogleAuthService {
    private _apiLoading = new BehaviorSubject<boolean>(true);
    readonly user = new ReplaySubject<User | null>(1);
    readonly isSignedIn = new ReplaySubject<boolean>(1);
    readonly apiLoading = this._apiLoading.asObservable().pipe(
        distinctUntilChanged(),
        shareReplay(1)
    );

    constructor(
        private readonly router: Router,
        private readonly alert: AlertService,
        private readonly http: HttpClient) {

        GoogleAuthService.loadApi().then(() => {
            const GoogleAuth = gapi.auth2.getAuthInstance();

            GoogleAuth.isSignedIn.listen((isSignedIn) => {
                this.isSignedIn.next(isSignedIn);
            });

            GoogleAuth.currentUser.listen((user) => {
                this._apiLoading.next(true);
                if (user.isSignedIn()) {

                    const authRes = user.getAuthResponse();
                    const profile = user.getBasicProfile();

                    const loginURL = `${ Environment.loginUrl }?id_token=${ authRes.id_token }`;
                    this.http.post(loginURL, {})
                        .pipe(
                            catchError((e) => {
                                this.alert.showError(JSON.stringify(e));
                                return of(null)
                            })
                        )
                        .subscribe(() => {
                            this.user.next({
                                accessToken: authRes.access_token,
                                email: profile.getEmail(),
                                picture: profile.getImageUrl()
                            });
                        });
                }
                else {
                    this.user.next(null);
                }
                this._apiLoading.next(false);
            });

            this._apiLoading.next(false);
        });
    }

    authInstance(): Observable<GoogleAuth> {
        return this._apiLoading.pipe(
            filter((loading) => !loading),
            take(1),
            map(() => gapi.auth2.getAuthInstance())
        );
    }

    signOut() {
        this.authInstance().subscribe((googleAuth) => {
            googleAuth.signOut();
            this.user.next(null);
        });
        this.router.navigate([]);
    }

    private static loadApi(): Promise<void> {
        return new Promise<void>((resolve => {
            gapi.load('auth2', () => {
                gapi.auth2.init({ client_id: Environment.googleClientID });
                resolve();
            });
        }));
    }
}
