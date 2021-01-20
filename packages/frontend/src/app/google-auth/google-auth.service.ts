import { Injectable } from "@angular/core";
import { Environment } from "../../environments/environment";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import {
    distinctUntilChanged,
    filter,
    map,
    shareReplay, take
} from "rxjs/operators";
import { AlertService } from "../alert/services/alert.service";
import GoogleAuth = gapi.auth2.GoogleAuth;
import { Router } from "@angular/router";

export interface User {
    idToken: string;
    email: string;
    picture: string;
}

@Injectable()
export class GoogleAuthService {
    private _apiLoading = new BehaviorSubject<boolean>(true);
    private _user = new ReplaySubject<User | null>(1);

    readonly user = this._user.asObservable().pipe(
        shareReplay(1)
    );

    readonly isSignedIn = this.user.pipe(
        map((user) => user !== null),
        distinctUntilChanged(),
        shareReplay(1)
    );

    readonly apiLoading = this._apiLoading.asObservable().pipe(
        distinctUntilChanged(),
        shareReplay(1)
    );

    constructor(
        private readonly router: Router,
        private readonly alert: AlertService) {

        GoogleAuthService.loadApi().then(() => {
            const GoogleAuth = gapi.auth2.getAuthInstance();

            GoogleAuth.currentUser.listen((user) => {
                if (user.isSignedIn()) {

                    const authRes = user.getAuthResponse();
                    const profile = user.getBasicProfile();

                    // const loginURL = `${ Environment.loginUrl }?id_token=${ authRes.id_token }`;
                    // this.http.post(loginURL, {})
                    //     .pipe(
                    //         catchError((e) => {
                    //             this.alert.showError(JSON.stringify(e));
                    //             return of(null)
                    //         })
                    //     )
                    //     .subscribe(() => {
                    //     });

                    this._user.next({
                        idToken: authRes.id_token,
                        email: profile.getEmail(),
                        picture: profile.getImageUrl()
                    });
                }
                else {
                    this._user.next(null);
                }
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
            this._user.next(null);
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
