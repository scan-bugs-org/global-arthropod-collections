import { Injectable } from "@angular/core";
import GoogleUser = gapi.auth2.GoogleUser;
import { BehaviorSubject, Observable, of, ReplaySubject } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Environment } from "../../environments/environment";
import { AlertService } from "./alert.service";
import { GoogleAuthService } from "../google-auth/google-auth.service";

export interface User {
    accessToken: string;
    email: string;
    picture: string;
}

@Injectable({
    providedIn: "root"
})
export class UserService {
    private _user = new BehaviorSubject<User | null>(null);
    public readonly user = this._user.asObservable().pipe(shareReplay(1));
    public readonly isLoggedIn = this._user.asObservable().pipe(
        map((user) => user !== null),
        shareReplay(1)
    );

    constructor(
        private readonly googleAuth: GoogleAuthService,
        private readonly alert: AlertService,
        private readonly http: HttpClient) {

        this.googleAuth.googleUser.subscribe((user) => {
            this.onGoogleSignIn(user);
        });
    }

    onGoogleSignIn(user: GoogleUser) {
        if (user.isSignedIn()) {
            const authRes = user.getAuthResponse();
            const profile = user.getBasicProfile();

            this._user.next({
                accessToken: authRes.access_token,
                email: profile.getEmail(),
                picture: profile.getImageUrl()
            });

            this.http.post(`${Environment.loginUrl}?id_token=${authRes.id_token}`, {})
                .pipe(
                    catchError((e) => {
                        this.alert.showError(JSON.stringify(e));
                        return of(null)
                    })
                )
                .subscribe();
        }
        else {
            this._user.next(null);
        }
    }
}
