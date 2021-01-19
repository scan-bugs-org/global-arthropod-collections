import { Injectable } from "@angular/core";
import GoogleUser = gapi.auth2.GoogleUser;
import { BehaviorSubject, of, ReplaySubject } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Environment } from "../../environments/environment";
import { AlertService } from "./alert.service";

export interface User {
    accessToken: string;
    idToken: string;
    email: string;
    picture: string;
}

@Injectable({
    providedIn: "root"
})
export class GoogleUserService {
    private _googleUser = new BehaviorSubject<User | null>(null);
    readonly googleUser = this._googleUser.asObservable().pipe(shareReplay(1));
    readonly isLoggedIn = this._googleUser.pipe(
        // TODO: Remove tap
        tap((user) => console.log(`Current user: ${JSON.stringify(user)}`)),
        map((user) => user !== null),
        shareReplay(1)
    );

    constructor(
        private readonly alert: AlertService,
        private readonly http: HttpClient) { }

    onGoogleSignIn(user: GoogleUser | null) {
        if (user !== null) {
            const authRes = user.getAuthResponse();
            const profile = user.getBasicProfile();

            this._googleUser.next({
                accessToken: authRes.access_token,
                idToken: authRes.id_token,
                email: profile.getEmail(),
                picture: profile.getImageUrl()
            });

            const idToken = user.getAuthResponse().id_token;

            this.http.post(`${Environment.loginUrl}?id_token=${idToken}`, {})
                .pipe(
                    catchError((e) => {
                        this.alert.showError(JSON.stringify(e));
                        return of(null)
                    })
                )
                .subscribe();
        }
    }
}
