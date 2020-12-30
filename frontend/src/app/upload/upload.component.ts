import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { AlertService } from '../services/alert.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FileUpload } from '../services/dto/file-upload.dto';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.less'],
})
export class UploadComponent {
    file: File | null = null;

    constructor(
        private readonly alerts: AlertService,
        private readonly uploads: UploadService,
        private readonly router: Router) { }

    onFileChanged(file: File | null) {
        this.file = file;
    }

    onSubmit() {
        if (this.file !== null) {
            this.uploads.uploadFile(this.file).pipe(
                catchError((e) => {
                    this.alerts.showError(e.toString());
                    return of(null);
                })
            ).subscribe((fileUpload) => {
                if (fileUpload) {
                    this.router.navigate([`./${fileUpload._id}`]);
                }
            });
        }
        else {
            this.alerts.showError("No file selected");
        }
    }
}
