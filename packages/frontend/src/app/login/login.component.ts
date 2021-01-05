import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { COLLECTION_ROUTE, LIST_ROUTE } from "../routes";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.less"]
})
export class LoginComponent implements OnInit {
    usernameControl = new FormControl('', [Validators.required]);
    passwordControl = new FormControl('', [Validators.required]);

    form = new FormGroup({
        'username': this.usernameControl,
        'password': this.passwordControl
    });

    constructor(
        private readonly router: Router,
        private readonly userService: UserService) { }

    ngOnInit() {
        this.userService.isLoggedIn.subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.router.navigate([`/${LIST_ROUTE}`]);
            }
        });
    }

    onLogin() {
        this.userService.login(
            this.usernameControl.value,
            this.passwordControl.value
        );
    }
}
