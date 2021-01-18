import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-google-sign-in",
    templateUrl: "./google-sign-in.component.html",
    styleUrls: ["./google-sign-in.component.less"]
})
export class GoogleSignInComponent implements OnInit {
    gApiReady = false;
    authInstance = null;

    constructor() { }

    ngOnInit(): void {
        gapi.load('auth2', () => {

        })
    }

    onSignIn() {
    }

    private static loadAuth(): Promise<gapi.auth2.GoogleAuth> {
        const loadPromise = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        })

        return loadPromise.then(async () => {
            return gapi.auth2.init({  }).then(auth => {
                return auth;
            })
        });
    }
}
