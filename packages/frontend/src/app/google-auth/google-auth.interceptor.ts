import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpHeaders
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { GoogleAuthService } from "./google-auth.service";
import { catchError, switchMap } from "rxjs/operators";
import { Environment } from "../../environments/environment";

@Injectable()
export class GoogleAuthInterceptor implements HttpInterceptor {

    constructor(private readonly googleAuth: GoogleAuthService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!request.url.startsWith(Environment.apiUrl)) {
            return next.handle(request);
        }

        return this.googleAuth.user.pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            switchMap((user) => {
                if (user) {
                    const bearerToken = `Bearer ${user.idToken}`;
                    const newHeaders = new HttpHeaders({
                        Authorization: bearerToken
                    });

                    request = request.clone({
                        headers: newHeaders,
                        withCredentials: true
                    });
                }
                return next.handle(request);
            })
        );
    }
}
