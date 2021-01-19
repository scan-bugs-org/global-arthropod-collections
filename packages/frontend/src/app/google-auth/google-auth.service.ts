import { Injectable } from "@angular/core";
import { Environment } from "../../environments/environment";
import GoogleAuth = gapi.auth2.GoogleAuth;
import { Observable, ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable()
export class GoogleAuthService {
    private apiLoaded = new ReplaySubject<void>(1);
    googleUser = new ReplaySubject<GoogleUser>(1);
    isSignedIn = new ReplaySubject<boolean>(1);

    constructor() {
        GoogleAuthService.loadApi().then(() => {
            this.apiLoaded.next();
        }).then(() => {
            const GoogleAuth = gapi.auth2.getAuthInstance();
            GoogleAuth.isSignedIn.listen((isSignedIn) => {
                this.isSignedIn.next(isSignedIn);
            });
            GoogleAuth.currentUser.listen((user) => {
                this.googleUser.next(user);
            });
        });
    }

    getAuthInstance(): Observable<GoogleAuth> {
        return this.apiLoaded.pipe(
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
