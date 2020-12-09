import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../services/dto/collection.dto';
import { AlertService } from '../services/alert.service';
import { FormControl, FormGroup } from '@angular/forms';

type TableData = { name: string, value: any };

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
    public sizeControl = new FormControl(0);
    public tierControl = new FormControl(4);
    public urlControl = new FormControl('');
    public iDigBioControl = new FormControl(false);

    public provinceControl = new FormControl('');
    public countryControl = new FormControl('');
    public latControl = new FormControl(0);
    public lngControl = new FormControl(0);

    public form = new FormGroup({
        'name': this.nameControl,
        'code': this.codeControl,
        'size': this.sizeControl,
        'tier': this.tierControl,
        'url': this.urlControl,
        'idigbio': this.iDigBioControl,
        'location': new FormGroup({
            'state': this.provinceControl,
            'country': this.countryControl,
            'lat': this.latControl,
            'lng': this.lngControl
        })
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
            'code': collection.code,
            'size': collection.size,
            'tier': collection.tier,
            'url': collection.url,
            'idigbio': collection.inIdigbio,
            'location': {
                'state': collection.location?.state,
                'country': collection.location?.country,
                'lat': collection.location?.lat,
                'lng': collection.location?.lng,
            }
        });
    }
}
