import { Component, OnInit } from "@angular/core";
import { CollectionService } from "../collection.service";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Collection } from "../dto/collection.dto";
import { INSTITUTION_ROUTE } from "../../routes";
import { GoogleAuthService } from "../../google-auth/google-auth.service";
import { AlertService } from "../../alert/services/alert.service";

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.less'],
})
export class CollectionComponent implements OnInit {
    readonly INSTITUTION_ROUTE = `/${INSTITUTION_ROUTE}`;

    public collection: Collection | null = null;

    constructor(
        private readonly userService: GoogleAuthService,
        private readonly currentRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly collections: CollectionService,
        private readonly alert: AlertService) { }

    ngOnInit(): void {
        this.loadCollection();
    }

    loadCollection() {
        this.currentRoute.paramMap
            .pipe(
                map((paramMap) => paramMap.get('id')),
                switchMap((iid) => this.collections.findByID(iid as string)),
                catchError(() => {
                    this.alert.showError('Error fetching collection');
                    return of(null);
                }),
            ).subscribe((collection) => {
            if (collection) {
                this.collection = collection;
            }
            else {
                this.router.navigate(['.']);
            }
        });
    }
}
