import { Component, OnInit } from "@angular/core";
import { CollectionListItem } from "../dto/collection-list-item.dto";
import { CollectionService } from "../collection.service";
import { GoogleAuthService } from "../../google-auth/google-auth.service";
import { map, switchMap } from "rxjs/operators";

@Component({
    selector: "app-collection-list",
    templateUrl: "./collection-list.component.html",
    styleUrls: ["./collection-list.component.less"]
})
export class CollectionListComponent implements OnInit {
    collections: CollectionListItem[] = [];

    constructor(
        private readonly googleAuth: GoogleAuthService,
        private readonly collectionService: CollectionService) { }

    ngOnInit(): void {
        this.googleAuth.user.pipe(
            switchMap((user) => {
                let email = user ? user.email : null;
                return this.collectionService.collectionList(email);
            }),
            map((collections) => {
                return collections.sort((a, b) => a.name.localeCompare(b.name))
            })
        ).subscribe((collections) => {
            this.collections = collections;
        });
    }
}
