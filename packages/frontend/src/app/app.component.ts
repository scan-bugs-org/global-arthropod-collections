import { Component, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { LIST_ROUTE, MAP_ROUTE, UPLOAD_ROUTE } from "./routes";
import { UserService, User } from "./services/user.service";
import { GoogleAuthService } from "./google-auth/google-auth.service";

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

    constructor(
        private readonly title: Title,
        private readonly userService: UserService,
        private readonly googleAuth: GoogleAuthService) {

        this.title.setTitle("Global Arthropod Collections");
    }

    ngOnInit() {
        this.userService.user.subscribe((user) => {
            this.currentUser = user;
        });
    }

    get isLoggedIn() {
        return this.currentUser !== null;
    }

    onSignOut() {
        this.googleAuth.getAuthInstance().subscribe((googleAuth) => {
            googleAuth.signOut();
        });
    }
}
