import { Injectable } from "@angular/core";
import GoogleUser = gapi.auth2.GoogleUser;
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { shareReplay } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class GoogleUserService {
    private googleUser = new BehaviorSubject<GoogleUser | null>(null);
    readonly user = this.googleUser.asObservable().pipe(shareReplay(1));

    constructor() { }

    update(user: GoogleUser | null) {
        this.googleUser.next(user);

        const profile = user?.getBasicProfile();
        console.log('ID: ' + profile?.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile?.getName());
        console.log('Image URL: ' + profile?.getImageUrl());
        console.log('Email: ' + profile?.getEmail()); // This is null if the 'email' scope is not present.
    }
}
