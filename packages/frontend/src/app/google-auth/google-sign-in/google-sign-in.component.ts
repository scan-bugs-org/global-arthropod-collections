import { Component, OnInit } from "@angular/core";
import { AlertService } from "../../services/alert.service";
import { UserService } from "../../services/user.service";
import { GoogleAuthService } from "../google-auth.service";

@Component({
    selector: "app-google-sign-in",
    templateUrl: "./google-sign-in.component.html",
    styleUrls: ["./google-sign-in.component.less"]
})
export class GoogleSignInComponent {
    constructor(
        private readonly userService: UserService,
        private readonly alert: AlertService,
        private readonly authService: GoogleAuthService) { }

    onSignIn() {
        this.authService.getAuthInstance().subscribe((googleAuth) => {
            googleAuth.signIn().then(() => {
                return googleAuth.grantOfflineAccess({ prompt: 'consent' })
            }).catch((e) => {
                this.alert.showError(JSON.stringify(e));
                this.userService.onGoogleSignIn(null);
            });
        });
    }
}
