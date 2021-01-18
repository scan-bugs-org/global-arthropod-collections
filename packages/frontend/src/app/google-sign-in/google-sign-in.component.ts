import { Component, OnInit } from "@angular/core";
import { AlertService } from "../services/alert.service";
import { Environment } from "../../environments/environment";

import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;

@Component({
    selector: "app-google-sign-in",
    templateUrl: "./google-sign-in.component.html",
    styleUrls: ["./google-sign-in.component.less"]
})
export class GoogleSignInComponent implements OnInit {
    gApiReady = false;
    authInstance: gapi.auth2.GoogleAuth | null = null;

    constructor(private readonly alert: AlertService) { }

    ngOnInit(): void {
        GoogleSignInComponent.loadAuth().then((auth) => {
            this.authInstance = auth;
            this.gApiReady = true;
        });
    }

    onSignIn() {
        this.authInstance?.signIn().then((user: GoogleUser) => {
            console.log(user);

        }).catch((e) => {
            this.alert.showError(JSON.stringify(e));
        });
    }

    private static loadAuth(): Promise<GoogleAuth> {
        const loadPromise = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        })

        return loadPromise.then(() => gapi.auth2.init({
            client_id: Environment.googleClientID
        }));
    }
}
