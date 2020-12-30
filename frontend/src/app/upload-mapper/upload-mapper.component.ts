import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../services/upload.service';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { of } from 'rxjs';

@Component({
    selector: 'app-upload-mapper',
    templateUrl: './upload-mapper.component.html',
    styleUrls: ['./upload-mapper.component.less'],
})
export class UploadMapperComponent implements OnInit {
    private uploadID: string = '';
    public headers: string[] = [];

    constructor(
        private readonly currentRoute: ActivatedRoute,
        private readonly uploads: UploadService,
        private readonly alerts: AlertService,
        private readonly router: Router) { }

    ngOnInit(): void {
        if (this.currentRoute.snapshot.paramMap.has('id')) {
            this.uploadID = this.currentRoute.snapshot.paramMap.get('id') as string;
            this.uploads.findByID(this.uploadID).pipe(
                catchError((e) => {
                    this.alerts.showError(JSON.stringify(e));
                    return of({ headers: [] });
                })
            ).subscribe((fileUpload) => {
                this.headers = fileUpload.headers;
            });
        }
        else {
            this.router.navigate(['/']);
        }
    }
}
