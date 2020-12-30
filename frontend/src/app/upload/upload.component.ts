import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.less'],
})
export class UploadComponent {
    file: File | null = null;

    constructor(
        private readonly alerts: AlertService,
        private readonly uploads: UploadService) { }

    onFileChanged(file: File | null) {
        this.file = file;
    }

    onSubmit() {
        if (this.file !== null) {
            this.uploads.doUpload(this.file);
        }
        else {
            this.alerts.showError("No file selected");
        }
    }
}
