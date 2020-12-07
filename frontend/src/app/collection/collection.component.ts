import { Component, OnInit } from '@angular/core';
import { CollectionListItem } from '../services/dto/collection-list-item.dto';
import { CollectionService } from '../services/collection.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../services/dto/collection.dto';
import { AlertService } from '../services/alert.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.less'],
})
export class CollectionComponent implements OnInit {
    public collection: Collection | null = null;
    public isEditing = false;

    public nameControl = new FormControl('');
    public codeControl = new FormControl('');

    public form = new FormGroup({
        'name': this.nameControl,
        'code': this.codeControl
    });

    constructor(
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
                this.resetValues(collection);
            }
            else {
                this.router.navigate(['.']);
            }
        });
    }

    applyEdits() {
        this.isEditing = false;
    }

    cancelEdits() {
        if (this.collection) {
            this.resetValues(this.collection);
        }
        this.isEditing = false;
    }

    private resetValues(collection: Collection) {
        this.form.patchValue({
            'name': collection.name,
            'code': collection.code
        });
    }
}
