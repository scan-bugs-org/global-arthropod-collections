import { Injectable } from "@angular/core";
import { Environment } from "../../environments/environment";
import GoogleAuth = gapi.auth2.GoogleAuth;
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { distinctUntilChanged, filter, map, shareReplay } from "rxjs/operators";
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable()
export class GoogleAuthService {
    private _apiLoading = new BehaviorSubject<boolean>(true);
    googleUser = new ReplaySubject<GoogleUser>(1);
    isSignedIn = new ReplaySubject<boolean>(1);
    apiLoading = this._apiLoading.asObservable().pipe(
        distinctUntilChanged(),
        shareReplay(1)
    );

    constructor() {
        GoogleAuthService.loadApi().then(() => {
            const GoogleAuth = gapi.auth2.getAuthInstance();
            GoogleAuth.isSignedIn.listen((isSignedIn) => {
                this.isSignedIn.next(isSignedIn);
            });
            GoogleAuth.currentUser.listen((user) => {
                this.googleUser.next(user);
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
