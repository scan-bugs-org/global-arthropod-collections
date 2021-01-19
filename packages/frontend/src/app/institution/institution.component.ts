import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { catchError, map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { InstitutionService } from '../services/institution.service';
import { Institution } from '../services/dto/institution.dto';
import { Observable, of } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { CollectionListItem } from '../services/dto/collection-list-item.dto';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { COLLECTION_ROUTE } from '../routes';
import { GoogleUserService } from "../services/google-user.service";

type ApiResult = {
    institution: Institution;
    collections: CollectionListItem[];
}

@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
    styleUrls: ['./institution.component.less'],
})
export class InstitutionComponent implements OnInit {
    readonly COLLECTION_ROUTE = `/${COLLECTION_ROUTE}`;

    public institution: Institution | null = null;
    public collections: CollectionListItem[] = [];
    public isEditing = false;
    public isLoggedIn = false;

    public readonly formControlCode = new FormControl('');
    public readonly formControlName = new FormControl('');
    public readonly form = new FormGroup({
        'code': this.formControlCode,
        'name': this.formControlName
    });

    constructor(
        private readonly userService: GoogleUserService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly institutions: InstitutionService,
        private readonly alert: AlertService) { }

    ngOnInit(): void {
        this.loadInstitution();
        this.currentRoute.queryParamMap.subscribe((paramMap) => {
            this.isEditing = paramMap.get('edit') === 'true';
        });

        this.userService.isLoggedIn.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
        });
    }

    applyEdits() {
        const institution = this.institution as Institution;
        this.isEditing = false;
        this.institutions.updateByID(institution._id, this.form.value)
            .pipe(
                catchError(() => {
                    this.alert.showError('Error updating institution')
                    return of();
                })
            )
            .subscribe(() => {
                this.loadInstitution();
                this.toggleEdit(false);
                this.alert.showMessage('Institution updated successfully');
            });
    }

    cancelEdits() {
        this.form.patchValue(this.institution as Institution);
        this.toggleEdit(false);
    }

    addCollection() {

    }

    toggleEdit(isEditing: boolean): void {
        const navParams: NavigationExtras = {
            relativeTo: this.currentRoute,
            queryParams: {}
        };

        if (isEditing) {
            const queryParams = navParams.queryParams as Params;
            queryParams.edit = 'true';
        }

        this.router.navigate([], navParams);
    }

    loadInstitution() {
        this.currentRoute.paramMap
            .pipe(
                map((paramMap) => paramMap.get('id')),
                switchMap((iid) => this.institutions.findByID(iid as string)),
                switchMap((institution) => {
                    return this.institutions.collections(institution._id).pipe(
                        map((collections) => {
                            return { institution, collections }
                        })
                    );
                }),
                catchError(() => {
                    this.alert.showError('Error fetching institution');
                    return of({ institution: null, collections: [] });
                }),
            ).subscribe(({ institution, collections }) => {
            if (institution) {
                this.institution = institution;
                this.collections = collections;
                this.form.patchValue(institution);
            }
            else {
                this.router.navigate(['.']);
            }
        });
    }
}
