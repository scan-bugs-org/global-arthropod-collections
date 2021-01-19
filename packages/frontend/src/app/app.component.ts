import { Component, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { LIST_ROUTE, MAP_ROUTE, UPLOAD_ROUTE } from "./routes";
import { GoogleUserService, User } from "./services/google-user.service";
import GoogleUser = gapi.auth2.GoogleUser;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    readonly MAP_ROUTE = MAP_ROUTE;
    readonly LIST_ROUTE = LIST_ROUTE;
    readonly UPLOAD_ROUTE = UPLOAD_ROUTE;

    isLoggedIn = false;
    currentUser: User | null = null;

    constructor(
        private readonly title: Title,
        private readonly userService: GoogleUserService) {

        this.title.setTitle("Global Arthropod Collections");
    }

    ngOnInit() {
        this.userService.isLoggedIn.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
        });

        this.userService.googleUser.subscribe((user) => {
            this.currentUser = user;
        });
    }

    logout() {

    }
}
