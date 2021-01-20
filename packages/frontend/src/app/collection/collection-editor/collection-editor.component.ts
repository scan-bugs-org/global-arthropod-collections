import { Component, OnInit } from "@angular/core";
import { Collection } from "../dto/collection.dto";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-collection-editor",
    templateUrl: "./collection-editor.component.html",
    styleUrls: ["./collection-editor.component.less"]
})
export class CollectionEditorComponent implements OnInit {
    collection: Collection | null = null;

    public nameControl = new FormControl('');
    public codeControl = new FormControl('');
    public sizeControl = new FormControl(0, [Validators.min(0)]);
    public tierControl = new FormControl(4, [Validators.min(0), Validators.max(4)]);
    public urlControl = new FormControl('');
    public iDigBioControl = new FormControl(false);

    public provinceControl = new FormControl('');
    public countryControl = new FormControl('');
    public latControl = new FormControl(0, [Validators.min(-90.0), Validators.max(90.0)]);
    public lngControl = new FormControl(0, [Validators.min(-180.0), Validators.max(180.0)]);

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

    constructor() { }

    ngOnInit(): void { }

    applyEdits() {

    }

    cancelEdits() {

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
