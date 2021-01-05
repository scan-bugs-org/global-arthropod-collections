import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "./loading.service";
import { Observable, of, ReplaySubject } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { User } from "./dto/user.dto";
import { Environment } from "../../environments/environment";
import { AlertService } from "./alert.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private static LOGIN_URL = Environment.loginUrl;
    private readonly _currentUser = new ReplaySubject<User | null>(1);

    get currentUser(): Observable<User | null> {
        return this._currentUser.asObservable();
    }

    get isLoggedIn(): Observable<boolean> {
        return this.currentUser.pipe(map((user) => user !== null));
    }

    constructor(
        private readonly loading: LoadingService,
        private readonly alert: AlertService,
        private readonly http: HttpClient) { }

    login(username: string, password: string) {
        this.loading.start();
        this.http.post<{ apiKey: string }>(UserService.LOGIN_URL, { username, password }).pipe(
            catchError((e) => {
                this.alert.showError("Login failed");
                return of(null);
            }),
            tap(() => this.loading.end())
        ).subscribe((loginData) => {
            if (loginData) {
                this._currentUser.next({ username, apiKey: loginData.apiKey });
            }
        });
    }

    logout() {
        this._currentUser.next(null);
    }
}
