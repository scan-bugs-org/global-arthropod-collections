import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GoogleAuthService } from "./google-auth.service";
import { GoogleSignInComponent } from "./google-sign-in/google-sign-in.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { AlertModule } from "../alert/alert.module";


@NgModule({
    imports: [
        AlertModule,
        CommonModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        BrowserModule
    ],
    providers: [
        GoogleAuthService
    ],
    declarations: [
        GoogleSignInComponent
    ],
    exports: [
        GoogleSignInComponent
    ]
})
export class GoogleAuthModule { }
