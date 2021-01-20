import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { LIST_ROUTE, MAP_ROUTE, UPLOAD_ROUTE } from "./routes";
import { GoogleAuthService, User } from "./google-auth/google-auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    readonly MAP_ROUTE = MAP_ROUTE;
    readonly LIST_ROUTE = LIST_ROUTE;
    readonly UPLOAD_ROUTE = UPLOAD_ROUTE;

    currentUser: User | null = null;
    isSignedIn = false;

    constructor(
        private readonly title: Title,
        private readonly userService: GoogleAuthService,
        private readonly googleAuth: GoogleAuthService) {

        this.title.setTitle("Global Arthropod Collections");
    }

    ngOnInit() {
        this.userService.user.subscribe((user) => {
            this.currentUser = user;
        });

        this.userService.isSignedIn.subscribe((isSignedIn) => {
            this.isSignedIn = isSignedIn;
        })
    }

    onSignOut() {
        this.googleAuth.signOut();
    }
}
