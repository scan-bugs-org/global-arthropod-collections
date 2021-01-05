import { Component, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { LIST_ROUTE, LOGIN_ROUTE, MAP_ROUTE, UPLOAD_ROUTE } from "./routes";
import { UserService } from "./services/user.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    readonly MAP_ROUTE = MAP_ROUTE;
    readonly LIST_ROUTE = LIST_ROUTE;
    readonly UPLOAD_ROUTE = UPLOAD_ROUTE;
    readonly LOGIN_ROUTE = LOGIN_ROUTE;

    isLoggedIn = false;

    constructor(
        private readonly title: Title,
        private readonly userService: UserService) {

        this.title.setTitle("Global Arthropod Collections");
    }

    ngOnInit() {
        this.userService.isLoggedIn.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
        });
    }

    logout() {
        this.userService.logout();
    }
}
