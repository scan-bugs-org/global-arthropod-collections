import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.less'],
})
export class UploadComponent {
    file: File | null = null;

    constructor(private readonly uploads: UploadService) { }

    onFileChanged(file: File | null) {
        this.file = file;
        console.log(file);
    }

    onSubmit() {

    }

    onClear() {

    }
}
