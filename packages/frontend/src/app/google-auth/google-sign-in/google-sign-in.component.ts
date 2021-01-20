import { Component, OnInit } from "@angular/core";
import { AlertService } from "../../alert/services/alert.service";
import { GoogleAuthService } from "../google-auth.service";

@Component({
    selector: "app-google-sign-in",
    templateUrl: "./google-sign-in.component.html",
    styleUrls: ["./google-sign-in.component.less"]
})
export class GoogleSignInComponent implements OnInit {
    isLoading = true;

    constructor(
        private readonly userService: GoogleAuthService,
        private readonly alert: AlertService,
        private readonly googleAuth: GoogleAuthService) { }

    ngOnInit(): void {
        this.googleAuth.apiLoading.subscribe((isLoading) => {
            this.isLoading = isLoading;
        });
    }

    onSignIn() {
        this.googleAuth.getAuthInstance().subscribe((googleAuth) => {
            googleAuth.signIn().then(() => {
                return googleAuth.grantOfflineAccess({ prompt: 'consent' })
            }).catch((e) => {
                this.alert.showError(JSON.stringify(e));
            });
        });
    }
}
