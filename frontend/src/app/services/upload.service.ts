import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FileUpload } from './dto/file-upload.dto';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { LoadingService } from './loading.service';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    public UPLOADS_URL = Environment.uploadUrl;

    constructor(
        private readonly loading: LoadingService,
        private readonly http: HttpClient) { }

    uploadFile(csv: File): Observable<FileUpload> {
        const form = new FormData();
        form.append('file', csv);

        this.loading.start();
        return this.http.post(this.UPLOADS_URL, form).pipe(
            map((upload) => plainToClass(FileUpload, upload)),
            tap(() => this.loading.end())
        );
    }
}
