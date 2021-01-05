import { AfterViewInit, Component, Directive, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../services/upload.service';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { of } from 'rxjs';
import { FileUpload } from '../services/dto/file-upload.dto';
import { UPLOAD_ROUTE } from "../routes";

@Component({
    selector: 'app-upload-mapper',
    templateUrl: './upload-mapper.component.html',
    styleUrls: ['./upload-mapper.component.less'],
})
export class UploadMapperComponent implements OnInit {
    private uploadID: string = '';
    private upload: FileUpload | null = null;

    mapping = new Map<string, string>();
    result = "";

    public tableColumns = [
        'csvHeader',
        'databaseField'
    ];

    get csvHeaders(): string[] {
        return this.upload ? this.upload.headers : [];
    }

    get requiredHeaders(): string[] {
        return this.upload ? this.upload.requiredHeaders : [];
    }

    get optionalHeaders(): string[] {
        return this.upload ? this.upload.optionalHeaders : [];
    }

    get allHeaders(): string[] {
        return [...this.requiredHeaders, ...this.optionalHeaders];
    }

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
                    return of(null);
                })
            ).subscribe((fileUpload) => {
                this.upload = fileUpload;
                this.allHeaders.forEach((header) => {
                    this.mapping.set(header, '');
                });
            });
        }
        else {
            this.router.navigate(['/']);
        }
    }

    onMappingChanged(csvHeader: string, databaseField: string) {
        this.mapping.set(csvHeader, databaseField);
    }

    onAutoMap() {
        for (let csvColumn of this.mapping.keys()) {
            if (this.allHeaders.includes(csvColumn)) {
                this.mapping.set(csvColumn, csvColumn);
            }
            else if (csvColumn === 'lat' && this.allHeaders.includes('latitude')) {
                this.mapping.set(csvColumn, 'latitude');
            }
            else if (csvColumn === 'lng' && this.allHeaders.includes('longitude')) {
                this.mapping.set(csvColumn, 'longitude');
            }
        }
    }

    onUpload() {
        this.uploads.mapUpload(this.uploadID, this.mapping).subscribe((r) => {
            this.result = JSON.stringify(r);
        });
    }

    onCancel() {
        this.router.navigate([UPLOAD_ROUTE]);
    }
}
