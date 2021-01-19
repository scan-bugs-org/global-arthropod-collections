import { Injectable } from "@angular/core";
import GoogleUser = gapi.auth2.GoogleUser;
import { BehaviorSubject, of, ReplaySubject } from "rxjs";
import { catchError, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Environment } from "../../environments/environment";
import { AlertService } from "./alert.service";

@Injectable({
    providedIn: "root"
})
export class GoogleUserService {
    private _googleUser = new BehaviorSubject<GoogleUser | null>(null);
    readonly googleUser = this._googleUser.asObservable().pipe(shareReplay(1));

    constructor(
        private readonly alert: AlertService,
        private readonly http: HttpClient) { }

    onGoogleSignIn(user: GoogleUser | null) {
        this._googleUser.next(user);

        if (user !== null) {
            const idToken = user.getAuthResponse().id_token;
            this.http.post(`${Environment.loginUrl}?id_token=${idToken}`, {})
                .pipe(
                    catchError((e) => {
                        this.alert.showError(JSON.stringify(e));
                        return of(null)
                    })
                )
                .subscribe((user) => {
                    console.log(user);
                })
        }
    }
}
