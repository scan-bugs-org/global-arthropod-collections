import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GoogleAuthService } from "./google-auth.service";
import { GoogleSignInComponent } from "./google-sign-in/google-sign-in.component";


@NgModule({
    imports: [
        CommonModule
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
