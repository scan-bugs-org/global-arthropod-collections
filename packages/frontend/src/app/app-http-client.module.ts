import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { GoogleAuthInterceptor } from "./google-auth/google-auth.interceptor";
import { LoadingInterceptor } from "./alert/loading.interceptor";


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: LoadingInterceptor },
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: GoogleAuthInterceptor },
    ],
    exports: [
        HttpClientModule
    ]
})
export class AppHttpClientModule {
}
