import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.less"]
})
export class LoginComponent {
    usernameControl = new FormControl('', [Validators.required]);
    passwordControl = new FormControl('', [Validators.required]);

    form = new FormGroup({
        'username': this.usernameControl,
        'password': this.passwordControl
    });

    constructor(private readonly userService: UserService) { }

    onLogin() {
        this.userService.login(
            this.usernameControl.value,
            this.passwordControl.value
        );
    }
}
