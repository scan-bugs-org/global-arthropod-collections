import { Component, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { LIST_ROUTE, MAP_ROUTE, UPLOAD_ROUTE } from "./routes";
import { GoogleUserService } from "./services/google-user.service";

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

    constructor(
        private readonly title: Title,
        private readonly userService: GoogleUserService) {

        this.title.setTitle("Global Arthropod Collections");
    }

    ngOnInit() {
        this.userService.isLoggedIn.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
        });
    }

    logout() {
    }
}
