import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
    COLLECTION_ROUTE,
    LIST_ROUTE,
    MAP_ROUTE,
    UPLOAD_ROUTE
} from "./routes";
import { GoogleAuthService, User } from "./google-auth/google-auth.service";
import { LoadingService } from "./alert/services/loading.service";
import { startWith } from "rxjs/operators";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    readonly MAP_ROUTE = MAP_ROUTE;
    readonly LIST_ROUTE = LIST_ROUTE;
    readonly UPLOAD_ROUTE = UPLOAD_ROUTE;
    readonly COLLECTION_ROUTE = COLLECTION_ROUTE;

    currentUser: User | null = null;

    constructor(
        private readonly title: Title,
        private readonly userService: GoogleAuthService) {

        this.title.setTitle("Global Arthropod Collections");
    }

    ngOnInit() {
        this.userService.user.subscribe((user) => {
            this.currentUser = user;
        });
    }

    onSignOut() {
        this.userService.signOut();
    }
}
