import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.less'],
})
export class UploadComponent {

    fileControl = new FormControl(null);
    form = new FormGroup({
        'file': this.fileControl
    });

    constructor(private readonly uploads: UploadService) { }

    onSubmit() {

    }

    onClear() {

    }
}
